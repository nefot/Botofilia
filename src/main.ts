import {Bot, BotOptions, createBot} from 'mineflayer';
import WebSocket from 'ws';
import {Logger} from './logger';
import {executeCommand} from './executeCommand';
import {sendChatEvent} from './sendChat';
// Неймспейс с настройками
namespace Settings {
    export const args: string[] = process.argv.slice(2);
    export const [username, password, host, port] = args;
    export const botOptions: BotOptions = {
        host,
        port: port ? parseInt(port) : 25565,
        username,
        password,
        version: '1.21.6',
    };
    export const wsUrl: string = 'ws://localhost:8080';
}

const logger = new Logger(Settings.username);
let bot: Bot;
let ws: WebSocket;
let chatSocket: WebSocket;

function createBotInstance(): void {

    bot = createBot(Settings.botOptions);

    bot.on('login', () =>
    {
        bot.chat(`/register ${Settings.password} ${Settings.password}`);
        bot.chat(`/login ${Settings.password}`);
        logger.logEvent(`Бот подключился к серверу ${Settings.host}:${Settings.botOptions.port}`);
    });

    bot.on('error', (err) =>
    {
        logger.error(`Ошибка: ${err}`);
    });

    bot.on('end', (reason) =>
    {
        logger.logEvent(`Бот отключился: ${reason}. Переподключение через 5 секунд...`);
        setTimeout(createBotInstance, 5000);
    });

    bot.on('kicked', (reason) =>
    {
        logger.error(`Бот кикнут: ${reason}`);
    });

    bot.on('messagestr', (message: string) =>
    {
        const match = message.match(/<([^>]+)> (.+)/);
        if (match)
            {
                const [, player, msg] = match;
                logger.logMessage(player, msg);
                const msg1 = {
                    event: false,
                    data: Date.now(),
                    player: player,
                    message: msg,
                };

                sendChatEvent('ws://localhost:9000', msg1);
            }
        else
            {
                logger.logEvent(message);
            }
    });

    bot.on('playerJoined', (player) =>
    {
        logger.logEvent(`Игрок ${player.username} подключился к игре`);
        const msg1 = {
            event: true,
            data: Date.now(),
            player: '-1',
            message: `Игрок ${player.username} подключился к игре`,
        };

        sendChatEvent('ws://localhost:9000', msg1);
    });

    bot.on('playerLeft', (player) =>
    {
        logger.logEvent(`Игрок ${player.username} покинул игру`);
        const msg1 = {
            event: true,
            data: Date.now(),
            player: '-1',
            message: `Игрок ${player.username} покинул к игре`,
        };

        sendChatEvent('ws://localhost:9000', msg1);
    });
}

// Функция для инициализации WebSocket

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
function initializeChatWebSocket(): void {
    chatSocket = new WebSocket('ws://localhost:9000');

    chatSocket.on('open', () => {
        logger.logEvent('Подключение к WebSocket чату установлено');

    });

    chatSocket.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.type === 'chat_from_tg') {
                const from = msg.author;
                const text = msg.text;
                bot.chat(`<${from}> ${text}`);
            }
        } catch (err) {
            logger.error(`Ошибка разбора сообщения от TG: ${err}`);
        }
    });

    chatSocket.on('close', () => {
        logger.logEvent('Чат WebSocket закрыт, переподключение через 5с...');
        setTimeout(initializeChatWebSocket, 5000);
    });

    chatSocket.on('error', (err) => {
        logger.error(`Ошибка в чат WebSocket: ${err}`);
    });
}

function initializeWebSocket(): void {
    // Определяем URL сервера: основной или резервный
    const wsUrl = reconnectAttempts === 0 ? Settings.wsUrl : 'ws://192.168.134.221:8080';
    ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        logger.logEvent(`Подключен к серверу команд: ${wsUrl}`);
        reconnectAttempts = 0; // Сброс счетчика попыток переподключения
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

    ws.on('close', () =>
    {
        logger.logEvent(`Соединение с сервером команд закрыто.`);

        if (reconnectAttempts < maxReconnectAttempts)
            {
                reconnectAttempts++;
                setTimeout(() =>
                {
                    logger.logEvent(`Попытка переподключения #${reconnectAttempts}...`);
                    initializeWebSocket(); // Повторная инициализация WebSocket
                }, 5000); // Задержка перед повторным подключением
            }
        else
            {
                logger.error(`Превышено максимальное количество попыток переподключения.`);
            }
    });

    ws.on('error', (err) =>
    {
        logger.error(`Ошибка WebSocket: ${err}`);
    });
}

// Основная функция для запуска бота
function main(): void {
    if (Settings.args.length < 3)
        {
            console.error('Использование: node main.ts <никнейм> <пароль> <адрес> [порт]');
            process.exit(1);
        }

    createBotInstance();
    initializeWebSocket();
    initializeChatWebSocket();

}

// Запуск программы
main();