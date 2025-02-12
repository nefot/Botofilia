import {Bot, BotOptions, createBot} from 'mineflayer';
import WebSocket from 'ws';
import {Logger} from './logger';
import {executeCommand} from "./executeCommand";

// Неймспейс с настройками
namespace Settings {
    export const args: string[] = process.argv.slice(2);
    export const [username, password, host, port] = args;
    export const botOptions: BotOptions = {
        host,
        port: port ? parseInt(port) : 25565,
        username,
        password,
        version: '1.21.4',
    };
    export const wsUrl: string = 'ws://localhost:8080';
}

const logger = new Logger(Settings.username);
let bot: Bot;
let ws: WebSocket;

function createBotInstance(): void {

    bot = createBot(Settings.botOptions);

    bot.on('login', () => {
        bot.chat(`/register ${Settings.password} ${Settings.password}`);
        bot.chat(`/login ${Settings.password}`);
        logger.logEvent(`Бот подключился к серверу ${Settings.host}:${Settings.botOptions.port}`);
    });

    bot.on('error', (err) => {
        logger.error(`Ошибка: ${err}`);
    });

    bot.on('end', (reason) => {
        logger.logEvent(`Бот отключился: ${reason}. Переподключение через 5 секунд...`);
        setTimeout(createBotInstance, 5000);
    });

    bot.on('kicked', (reason) => {
        logger.error(`Бот кикнут: ${reason}`);
    });

    bot.on('messagestr', (message: string) => {
        const match = message.match(/<([^>]+)> (.+)/);
        if (match) {
            const [, player, msg] = match;
            logger.logMessage(player, msg);
        } else {
            logger.logEvent(message);
        }
    });

    bot.on('playerJoined', (player) => {
        logger.logEvent(`Игрок ${player.username} подключился к игре`);
    });

    bot.on('playerLeft', (player) => {
        logger.logEvent(`Игрок ${player.username} покинул игру`);
    });
}

// Функция для инициализации WebSocket
function initializeWebSocket(): void {
    ws = new WebSocket(Settings.wsUrl);
    let n = false
    ws.on('open', () => {
        logger.logEvent(`Подключен к серверу команд.`);
        ws.send(`${Settings.username} register`);
    });

    ws.on('message', (data: WebSocket.RawData) => {
        try {
            const message = data.toString().trim();
            if (message.startsWith('Ошибка:')) {
                logger.error(`Игнорируем сообщение сервера: ${message}`);
                return;
            }
            executeCommand(message, logger, bot);

        } catch (err) {
            logger.error(`Ошибка обработки команды: ${err}`);
        }
    });

    ws.on('close', () => {
        logger.logEvent(`Соединение с сервером команд закрыто.`);

        if (!n) {
            ws = new WebSocket('ws://192.168.134.221:8080')

            initializeWebSocket()
            n = true
        }
    });

    ws.on('error', (err) => {
        logger.error(`Ошибка WebSocket: ${err}`);
    });
}

// Основная функция для запуска бота
function main(): void {
    if (Settings.args.length < 3) {
        console.error('Использование: node main.ts <никнейм> <пароль> <адрес> [порт]');
        process.exit(1);
    }

    createBotInstance();
    initializeWebSocket();
}

// Запуск программы
main();