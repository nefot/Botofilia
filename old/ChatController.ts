import * as mineflayer from 'mineflayer';
import * as fs from 'fs';

class ChatController {
    private readonly bot: mineflayer.Bot;
    private readonly logFolderPath: string;
    private chat_logger: boolean;

    constructor(bot: mineflayer.Bot, logFolderPath: string, chat_logger: boolean = false) {
        this.bot = bot;
        this.logFolderPath = logFolderPath;
        this.chat_logger = chat_logger;

    }

    public saveToLog(text: string): void {
        const currentDate = new Date();
        const logFolder = `${this.logFolderPath}${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
        const logFileName = `${logFolder}/log.txt`;

        if (!fs.existsSync(logFolder)) {
            fs.mkdirSync(logFolder, {recursive: true});
        }

        fs.appendFile(logFileName, `${text}\n`, (err) => {
            if (err) {
                console.error('Error writing to log:', err);
            }
        });
    }

    public sendMessage(message: string): void {
        if (this.bot && this.bot.chat) {
            this.bot.chat(message);
        } else {
            console.error('Bot is not ready to send messages yet.');
        }
    }

    public sendDirectMessage(player: string, message: string): void {
        this.bot.whisper(player, message);
    }

    public getCurrentDateTime(): string {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return `[${date} ${time}]`;
    }
}


// class ChatMessage {
//     private strikethrough: undefined;
//     constructor() {
//         this.json = {};
//         this.warn = '';
//         this.translate = '';
//         this.with = '';
//         this.bold = undefined;
//         this.italic = undefined;
//         this.underlined = undefined;
//         this.strikethrough = undefined;
//         this.obfuscated = undefined;
//         this.color = undefined;
//
//     }
// }
//
//
// function message_handler(message: object) {
//
// }

export {ChatController};
