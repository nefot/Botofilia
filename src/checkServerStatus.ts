import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';
import axios from 'axios';

const HOST = '77.235.121.114';
const PORT = 25565;
const LOGS_BASE = path.join(__dirname, 'logs');

async function sendToBot(data: { online: number; max: number; players: string[] }) {
    try
        {
            await axios.post('http://localhost:8000/update_status', data);
            console.log('Данные отправлены боту');
        }
    catch (error)
        {
            console.error('Ошибка при отправке данных в бота:', error);
        }
}

function getLogPaths() {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const day = String(now.getDate()).padStart(2, '0');
    const logDir = path.join(LOGS_BASE, yearMonth);
    const logFile = path.join(logDir, `${day}.log`);
    return {logDir, logFile, timestamp: now.toISOString()};
}

function writeLog(filePath: string, content: string) {
    fs.appendFileSync(filePath, content + '\n', 'utf8');
}

function ensureDirExists(dir: string) {
    if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir, {recursive: true});
        }
}

async function handleServerResponse(host: string, port: number, response: any) {
    const {logDir, logFile, timestamp} = getLogPaths();
    ensureDirExists(logDir);

    let logData = `[${timestamp}] Сервер: ${host}:${port}\n`;

    if ('players' in response)
        {
            const players = response.players.sample?.map((p: { name: string }) => p.name) || [];
            await sendToBot({online: response.players.online, max: response.players.max, players});
            logData += `Онлайн: ${response.players.online}/${response.players.max}\n`;

            if (players.length > 0)
                {
                    logData += 'Игроки онлайн:\n' + players.map((name: string) => `- ${name}`).join('\n') + '\n';
                }
            else
                {
                    logData += 'Нет информации о игроках.\n';
                }
        }
    else
        {
            logData += 'Не удалось получить данные о игроках.\n';
        }

    writeLog(logFile, logData);
    console.log('Данные о сервере сохранены в', logFile);
}

async function checkServerStatus(host: string, port: number) {
    try
        {
            const response = await mc.ping({host, port});
            await handleServerResponse(host, port, response);
        }
    catch (error)
        {
            console.error('Ошибка при проверке сервера:', error);
        }
}

function addHourlySeparator() {
    const {logDir, logFile} = getLogPaths();
    ensureDirExists(logDir);
    const separator = '\n------------------------------------------------------------------------\n';
    writeLog(logFile, separator);
    console.log('Добавлен разделитель в', logFile);
}

// Интервалы
setInterval(() => checkServerStatus(HOST, PORT), 10 * 1000);
setInterval(addHourlySeparator, 60 * 60 * 1000);
checkServerStatus(HOST, PORT);
