import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';

async function checkServerStatus(host: string, port: number = 25565) {
    try {
        const response = await mc.ping({ host, port });
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

        if ('players' in response) {
            logData += `Онлайн: ${response.players.online}/${response.players.max}\n`;

            if (response.players.sample && response.players.sample.length > 0) {
                logData += "Игроки онлайн:\n";
                response.players.sample.forEach((player: { name: string }) => {
                    logData += `- ${player.name}\n`;
                });
            } else {
                logData += "Нет информации о игроках.\n";
            }
        } else {
            logData += "Не удалось получить данные о игроках.\n";
        }

        fs.appendFileSync(logFile, logData + "\n", 'utf8');
        console.log("Данные о сервере сохранены в", logFile);
    } catch (error) {
        console.error("Ошибка при проверке сервера:", error);
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
    fs.appendFileSync(logFile, separator, 'utf8');
    console.log("Добавлен разделитель в", logFile);
}

// Запуск проверки сервера каждые 10 секунд
setInterval(() => checkServerStatus('77.235.121.114', 25565), 10 * 1000);

// Запуск добавления разделителя каждый час
setInterval(addHourlySeparator, 60 * 60 * 1000);

// Первоначальный запуск проверки сервера
checkServerStatus('77.235.121.114', 25565);