import * as mineflayer from 'mineflayer';
import { Terminal } from './terminal';
import 'colorts/lib/string';
import { MovementController } from './MovementController';
import { ChatController } from './ChatController';
import fs from "fs";
import path from "path";

class Coordinates {
    constructor(public x: number, public y: number, public z: number) {}

    // Метод для вывода координат в виде строки
    toString(): string {
        return `x=${this.x}, y=${this.y}, z=${this.z}`;
    }
}

// Интерфейс для классов, которые могут считывать координаты из лога
interface LogReader {
    readCoordinatesFromLog(log: string): Coordinates | null;
}

// Класс для чтения координат из файла лога
class LogFileReader implements LogReader {
    readCoordinatesFromLog(log: string): Coordinates | null {
        try {
            console.log('readCoordinatesFromLog');
            // Регулярное выражение для поиска координат в строке лога
            const regex = /\[.*?\] \{.*?\} Dimension: \w+, Coordinates: x=(-?\d+\.\d+), y=(-?\d+\.\d+), z=(-?\d+\.\d+)/;
            const match = log.match(regex);
            console.log(match, log);

            if (match) {
                const x = parseFloat(match[1]);
                const y = parseFloat(match[2]);
                const z = parseFloat(match[3]);
                return new Coordinates(x, y, z);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error reading log:", error);
            return null;
        }
    }

    // Метод для чтения координат из файла лога
    readCoordinatesFromLogFile(filePath: string | undefined): Coordinates | null {
        if (!filePath || !fs.existsSync(filePath)) {
            console.error("Файл не найден или путь неверный:", filePath);
            return null;
        }
        try {
            // Чтение содержимого файла
            const content = fs.readFileSync(filePath, 'utf-8');
            // Разбиение содержимого на строки
            const lines = content.split('\n');
            // Поиск последней непустой строки
            let lastLine = lines[lines.length - 1];
            if (!lastLine.trim()) {
                lastLine = lines[lines.length - 2];
            }
            // Вызов метода readCoordinatesFromLog для обработки последней строки
            return this.readCoordinatesFromLog(lastLine);
        } catch (error) {
            console.error("Error reading log file:", error);
            return null;
        }
    }
}

// Пример использования класса
const logFilePath = 'D:/Desktop/mineflayer_bot/dist/Death/Death.log'; // Укажите правильный путь к вашему файлу лога
const logReader = new LogFileReader();
const coordinates = logReader.readCoordinatesFromLogFile(logFilePath);
if (coordinates) {
    console.log("Coordinates:", coordinates.toString());
} else {
    console.log("Failed to read coordinates from log file.");
}

class ChatHandler {
    private bot: mineflayer.Bot;
    private movementController: MovementController;
    private chat: ChatController;
    private logDir: string = path.join(__dirname, 'Death', 'Death.log');
    private t: Terminal;
    private logReader: LogFileReader;

    constructor(bot: mineflayer.Bot, terminal: Terminal) {
        this.bot = bot;
        this.logReader = new LogFileReader();
        this.chat = new ChatController(this.bot, '');
        this.t = terminal;
        this.movementController = new MovementController(this.bot, this.chat, terminal); // Передаем chat и terminal
    }

    public death() {
        const coordinates = this.logReader.readCoordinatesFromLogFile(this.logDir);
        if (coordinates != null) {
            this.t.printMessage(this.logDir);
            this.t.printMessage(coordinates ? coordinates.toString() : "Записей о смерти нет");
            return coordinates ? coordinates.toString() : "Записей о смерти нет";
        }
        return 'Записей о смерти нет';
    }

    public handleChatMessage(username: string, message: string): void {
        const mes: string[] = message.toLowerCase().split(' ');
        const command = mes[0];
        console.log(`Processing command: ${command}`);

        switch (command) {
            case 'goto':
                this.t.printMessage(`${username} ${this.movementController.gotoBlock(mes[1], mes[2], mes[3], username)}`);
                break;
            case 'come':
                this.t.printMessage(`${username}, ${this.movementController.comeToPlayer(username)}`);
                break;
            case 'stop':
                this.t.printMessage(`${username}, ${this.movementController.stopBot(username)}`);
                break;
            case 'echo':
                const mes1: string = mes.slice(1).join(' ');
                this.t.printMessage(mes1);
                break;
            case 'mine':
                this.t.printMessage('mine');
                break;
            case 'health':
                this.t.printMessage(`/msg ${username} здоровье: ${this.bot.health} насыщение: ${this.bot.food} позиция: ${this.bot.entity.position}`);
                break;
            case 'last':
                switch (mes[1]) {
                    case 'death':
                        this.t.printMessage(this.death());
                        break;
                    default:
                        this.t.printMessage(`Command '${command}' '${mes[1]}' is not recognized.`);
                }
                break;
            default:
                this.t.printMessage(`Command '${command}' is not recognized.`);
                break;
        }
    }
}

class MinecraftBot {
    public bot: mineflayer.Bot;
    private readonly password: string;
    private readonly username: string;
    private readonly logFolderPath: string;
    private readonly ch: boolean;
    public chatHandler: ChatHandler;
    public terminal: Terminal;

    constructor(
        username: string,
        password: string,
        host: string,
        port: string | number,
        chat_logger: boolean,
        options?: any
    ) {
        this.ch = chat_logger;
        this.username = username;
        this.password = password;
        this.logFolderPath = `${__dirname}/logs`;
        this.bot = mineflayer.createBot({
            username: username,
            password: password,
            host: host,
            port: port,
            ...options,
        });

        this.terminal = new Terminal(); // Создаем экземпляр Terminal

        this.chatHandler = new ChatHandler(this.bot, this.terminal); // Передаем terminal в ChatHandler
        this.terminal.setChatHandler(this.chatHandler); // Устанавливаем ChatHandler в Terminal

        console.log('ChatHandler initialized in MinecraftBot:', this.chatHandler);

        this.setupEvents();
    }

    private checkBotReady(): boolean {
        return this.bot && typeof this.bot.chat === 'function';
    }

    public login(): void {
        if (!this.checkBotReady()) {
            console.log('Bot is not ready to log in');
            return;
        }
        this.bot.chat(`/register ${this.password} ${this.password}`);
        this.bot.chat(`/login ${this.password}`);
        console.log((`Bot ${this.username} logged into the game`).blue);
    }

    private setupEvents(): void {
        this.bot.on('chat', (username, message) => {
            console.log(`${new Date().toISOString()} <${username}> ${message}`);
        });

        this.bot.on('spawn', () => {
            this.login();
        });

        this.bot.on('playerJoined', (player) => {
            console.log((`${player.username} joined the game`).yellow);
        });

        this.bot.on('death', () => {
            console.log('DEATH');
        });

        this.bot.on('playerLeft', (player) => {
            console.log((`${player.username} left the game`).red);
        });

        this.bot.on('whisper', (username, message) => {
            this.chatHandler.handleChatMessage(username, message);
        });

        this.bot.once('spawn', () => {
            this.login();
        });

        this.bot.on('goal_reached', () => {
            console.log('Reached goal');
        });
    }
}

// Экспортируем классы
export {MinecraftBot, ChatHandler};

// Создание и запуск бота
const bot = new MinecraftBot(
    process.argv[2],
    process.argv[3],
    process.argv[4],
    parseInt(process.argv[5]),
    process.argv[6] === "true"
);

// Инициализация Terminal
bot.terminal.printMessage('Welcome to the terminal!');
bot.terminal.prompt();
