import * as mineflayer from 'mineflayer';
import * as fs from 'fs';
import chalk from 'chalk';


class ChatController {
    private readonly bot: mineflayer.Bot;
    private readonly password: string
    private readonly username: string

    constructor(bot: mineflayer.Bot, password: string, username: string) {
        this.bot = bot;
        this.password = password;
        this.username = username;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.bot.on('chat', (username, message) => {
            // if (username !== this.bot.username) {
            console.log((`${this.getCurrentDateTime()} <${username}> ${message}`));
            // this.handleChatMessage(username, message);
            // this.logChatMessage(username, message);
            // }
        });

        this.bot.once('spawn', () => {
            this.login()
        });

        // Добавьте другие обработчики событий по мере необходимости
    }

    public handleChatMessage(username: string, message: string): void {
        message = message.toLowerCase().split(" ")[0]
        switch (message) {
            case 'goto':
                // this.movementController.gotoBlock(message[1], message[2], message[3], '');
                break;
            case 'come':
                // this.movementController.comeToPlayer();
                break;
            default:
                // Действие по умолчанию для неизвестных сообщений
                break;
        }
    }

    // Add other methods as need edt


    private checkBotReady() {
        return this.bot && typeof this.bot.chat === 'function';
    }

    private login() {
        if (!this.checkBotReady()) {
            console.log('Bot is not ready to log in');
            return;
        }

        this.bot.chat(`/login ${this.password}`);
        console.log(`Бот ${this.username} вошел в игру`);
    }

    public sendMessage(message: string) {
        if (this.bot && this.bot.chat) {
            this.bot.chat(message);
        } else {
            console.error('Bot is not ready to send messages yet.');
        }
    }

    public sendDirectMessage(player: string, message: string) {
        this.bot.whisper(player, message);
    }

    public getCurrentDateTime(): string {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return `[${date} ${time}]`;
    }

    // private logChatMessage(username: string, message: string) {
    //     const formattedMessage = `${this.getCurrentDateTime()} [${username}] ${message}\n`;
    //     fs.appendFile(this.chatLogPath, formattedMessage, (err) => {
    //         if (err) {
    //             console.error('Error writing to chat log:', err);
    //         }
    //     });
    // }
}

export {ChatController};
