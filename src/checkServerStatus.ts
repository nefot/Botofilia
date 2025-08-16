import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';




async function checkServerStatus(host: string, port: number = 25565) {
    console.log(`🔍 Пингуем: ${host}:${port}`);

    // Оборачиваем ping в Promise, чтобы контролировать ошибки
    const response = await new Promise<any>((resolve, reject) => {
        // Устанавливаем таймаут вручную
        const timeoutId = setTimeout(() => {
            reject(new Error('Ping timeout: сервер не отвечает'));
        }, 10000); // 10 секунд

        // Вызываем ping с коллбэком
        mc.ping(
            { host, port },
            (err: Error | null, data: any) => {
                clearTimeout(timeoutId); // снимаем таймаут

                if (err) {
                    reject(err);
                    return;
                }

                if (!data || typeof data !== 'object') {
                    reject(new Error('Пустой или некорректный ответ от сервера (null)'));
                    return;
                }

                resolve(data);
            }
        );
    }).catch(err => {
        console.error(`🔴 Ошибка ping:`, err.message || err);
        return null; // возвращаем null при ошибке
    });

    // Если ошибка — выходим
    if (response === null) {
        return;
    }

    // Теперь response — гарантированно объект
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const logDir = path.join(__dirname, 'logs', `${year}-${month}`);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `${day}.log`);
    const timestamp = now.toISOString();
    let logData = `[${timestamp}] Сервер: ${host}:${port}\n`;

    if ('players' in response && response.players) {
        const online = response.players.online ?? 'неизвестно';
        const max = response.players.max ?? 'неизвестно';
        logData += `Онлайн: ${online}/${max}\n`;

        if (Array.isArray(response.players.sample) && response.players.sample.length > 0) {
            logData += "Игроки онлайн:\n";
            response.players.sample.forEach((player: any) => {
                const name = typeof player.name === 'string' ? player.name : 'неизвестный';
                logData += `- ${name}\n`;
            });
        } else {
            logData += "Нет информации о игроках.\n";
        }
    } else {
        logData += "Не удалось получить данные о игроках.\n";
    }

    try {
        fs.appendFileSync(logFile, logData + "\n", 'utf8');
        console.log("✅ Данные сохранены в", logFile);
    } catch (error) {
        console.error("❌ Ошибка записи лога:", error);
    }
}

function addHourlySeparator() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const logDir = path.join(__dirname, 'logs', `${year}-${month}`);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `${day}.log`);
    const separator = `\n------------------------------------------------------------------------\n`;
    try {
        fs.appendFileSync(logFile, separator, 'utf8');
        console.log("Добавлен разделитель в", logFile);
    } catch (error) {
        console.error("Ошибка при записи разделителя:", error);
    }
}

// Запуск проверки каждые 10 секунд
setInterval(() => checkServerStatus('birchcraft.hopto.org', 25565), 10 * 1000);

// Разделитель каждый час
setInterval(addHourlySeparator, 60 * 60 * 1000);

// Первоначальный запуск
checkServerStatus('birchcraft.hopto.org', 25565);