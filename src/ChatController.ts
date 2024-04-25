import * as mineflayer from 'mineflayer';
import * as fs from 'fs';
import chalk from 'chalk';

import path from 'path';




class ChatController {
    private readonly bot: mineflayer.Bot; // тип mineflayer.Bot заменен на any
    private readonly logFolderPath: string; // Путь к папке с логами
    private chat_logger: boolean;


    constructor(bot: mineflayer.Bot, logFolderPath: string, chat_logger: boolean = false) {
        this.bot = bot;
        this.logFolderPath = logFolderPath;
        this.chat_logger = chat_logger;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.bot.on('chat', (username, message) => {
            // console.log((`${this.getCurrentDateTime()} <${username}> ${message}`));
            // this.saveToLog((`${this.getCurrentDateTime()} <${username}> ${message}`));
            // console.log(typeof username);

        });


        // Добавьте другие обработчики событий по мере необходимости
    }

    public saveToLog(text: string): void {
        if (!this.chat_logger) {
            return
        }
        const currentDate = new Date();
        let logFolder: string = ''
        logFolder = logFolder.concat(this.logFolderPath, currentDate.getFullYear().toString(), (currentDate.getMonth() + 1).toString(), currentDate.getDate().toString());

        // Создание папки, если она не существует
        if (!fs.existsSync(logFolder)) {
            fs.mkdirSync(logFolder, {recursive: true});
        }
        let logFileName: string = ''
        logFileName = logFileName.concat(logFolder, 'log.txt');

        // Добавление текста в лог
        fs.appendFile(logFileName, `${currentDate.toLocaleString()}: ${text}\n`, (err) => {
            if (err) {
                console.error('Произошла ошибка при записи в лог:', err);
            } else {
                // console.log('Текст успешно сохранен в логе.');
            }
        });
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
