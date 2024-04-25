import * as mineflayer from 'mineflayer';
import {MovementController} from './MovementController';
import {ChatController} from './ChatController';
import net from 'net';
import 'colorts/lib/string';

class MinecraftBot {
    public bot: mineflayer.Bot;
    private readonly password: string;
    private readonly username: string;
    private movementController: MovementController;
    private chat: ChatController;
    private controller_port: number;
    private controller_host: string;
    private logFolderPath: string;
    private ch: boolean;

    constructor(
        username: string,
        password: string,
        host: string,
        port: string | number,
        chat_logger: boolean,
        options?: any
    ) {
        this.ch = true;
        this.username = username;
        this.password = password;
        this.bot = mineflayer.createBot({
            username: username,
            password: password,
            host: host,
            port: port,
            ...options,
        });
        this.logFolderPath = `${__dirname},/, logs`;
        this.movementController = new MovementController(this.bot);
        this.chat = new ChatController(this.bot, this.logFolderPath, this.ch);

        this.controller_port = 7777;
        this.controller_host = 'localhost';
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

    private runServerController(): void {
        const server: net.Server = net.createServer((socket: net.Socket) => {
            console.log('Client connected');

            socket.on('data', (data: Buffer) => {
                const command: string = data.toString().trim();
                console.log('Received command:', command);
            });

            socket.on('end', () => {
                console.log('Client disconnected');
            });
        });

        server.on('error', (err: NodeJS.ErrnoException) => {
            console.error('Server error:', err);
        });

        server.listen(this.controller_port, () => {
            console.log(`Server listening on port ${this.controller_port}`);
        });
    }

    public handleChatMessage(username: string, message: string): void {
        const mes: string[] = message.toLowerCase().split(' ');
        message = mes[0];

        switch (message) {
            case 'goto':
                this.chat.sendDirectMessage(username, this.movementController.gotoBlock(mes[1], mes[2], mes[3], username));
                break;
            case 'come':
                this.chat.sendDirectMessage(username, this.movementController.comeToPlayer(username));
                break;
            case 'stop':
                this.chat.sendDirectMessage(username, this.movementController.stopBot(username));
                break;
            case 'echo':
                const mes1: string = mes.slice(1).join(' ');
                this.chat.sendMessage(mes1);
                break;
            case 'mine':
                console.log('mine');
                break;
            default:
                break;
        }
    }

    private setupEvents(): void {
        this.bot.on('chat', (username, message) => {
            console.log(`${this.chat.getCurrentDateTime()} <${username}> ${message}`);
            console.log(this.ch)
            if (this.ch) {
                this.chat.saveToLog((`${this.chat.getCurrentDateTime()} <${username}> ${message}`));
            }
        });

        this.bot.on('spawn', () => {
        });

        this.bot.on('playerJoined', (player) => {
            console.log((`${player.username} joined the game`).yellow);
        });

        this.bot.on('death', () => {
            console.log('DEATH');
        });

        this.bot.on('playerLeft', (username) => {
            console.log((`${username.displayName} left the game`).red);
        });

        this.bot.on('whisper', (username, message) => {
            this.handleChatMessage(username, message);});

        this.bot.once('spawn', () => {
            this.login();
        });

        this.bot.on('goal_reached', () => {
            console.log('Reached goal');
        });
    }
}

const bot = new MinecraftBot(
    process.argv[2],
    process.argv[3],
    process.argv[4],
    parseInt(process.argv[5]),
    process.argv[6] == "true"
);