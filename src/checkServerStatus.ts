import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';

async function checkServerStatus(host: string, port: number = 25565) {
    let response;

    try {
        // Основной вызов ping
        response = await mc.ping({ host, port, timeout: 10000 }); // таймаут 10 сек
    } catch (error: any) {
        console.error(`Ошибка при пинге сервера ${host}:${port}:`, error.message || error);
        return; // выходим, если ошибка сети/таймаут
    }

    // 🔴 Проверяем, что response — это объект, а не null
    if (!response || typeof response !== 'object') {
        console.error(`Пустой ответ от сервера ${host}:${port}`);
        return;
    }

    // Теперь безопасно работаем с response
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

    // Проверяем наличие данных об игроках
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
        console.log("Данные о сервере сохранены в", logFile);
    } catch (error) {
        console.error("Ошибка при записи лога:", error);
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