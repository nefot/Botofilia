import * as mineflayer from 'mineflayer';
import * as fs from 'fs';
import chalk from 'chalk';


class ChatController {
    private readonly bot: mineflayer.Bot;


    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.bot.on('chat', (username, message) => {
            console.log((`${this.getCurrentDateTime()} <${username}> ${message}`));
            // console.log(typeof username);

        });


        // Добавьте другие обработчики событий по мере необходимости
    }

    // Add other methods as need edt

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
