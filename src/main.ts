import * as mineflayer from 'mineflayer';
import {Terminal} from './terminal';
import 'colorts/lib/string';
import {MovementController} from './MovementController';
import {ChatController} from './ChatController';

class ChatHandler {
    private bot: mineflayer.Bot;
    private movementController: MovementController;
    private chat: ChatController;
    private t: Terminal;

    constructor(bot: mineflayer.Bot, terminal: Terminal) {
        this.bot = bot;
        this.chat = new ChatController(this.bot, '');
        this.t = terminal
        this.movementController = new MovementController(this.bot, this.chat, terminal); // Передаем chat и terminal
    }

    public handleChatMessage(username: string, message: string): void {
        const mes: string[] = message.toLowerCase().split(' ');
        const command = mes[0];
        console.log(`Processing command: ${command}`);

        switch (command) {
            case 'goto':
                this.t.printMessage(`${username} ${this.movementController.gotoBlock(mes[1], mes[2], mes[3], username)}`)
                break;
            case 'come':
                this.t.printMessage(`${username}, ${this.movementController.comeToPlayer(username)}`);
                break;
            case 'stop':
                this.t.printMessage(`${username}, ${ this.movementController.stopBot(username)}`);
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
