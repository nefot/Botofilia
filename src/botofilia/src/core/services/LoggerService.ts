import fs from 'fs';
import {ILogger} from '../interfaces/Logger';

export class LoggerService implements ILogger {
    private chatLogStream = fs.createWriteStream('chat.log', {flags: 'a'});
    private eventLogStream = fs.createWriteStream('events.log', {flags: 'a'});

    logChatMessage(username: string, message: string): void {
        const logEntry = `[${new Date().toISOString()}] ${username}: ${message}\n`;
        this.chatLogStream.write(logEntry);
    }

    logEvent(event: string): void {
        const logEntry = `[${new Date().toISOString()}] ${event}\n`;
        this.eventLogStream.write(logEntry);
    }
}
