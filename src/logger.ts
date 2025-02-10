import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private logFilePath: string;

  constructor(botName: string) {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    this.logFilePath = path.join(logsDir, `${botName}.log`);
  }

  private getTimestamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${day}.${month}.${year} ${hours}:${minutes}:${seconds}]`;
  }

  logEvent(event: string): void {
    const logMessage = `${this.getTimestamp()} [событие] ${event}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
    console.log(logMessage.trim()); // Также выводим в консоль для удобства
  }

  logMessage(username: string, message: string): void {
    const logMessage = `${this.getTimestamp()} <${username}> ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
    console.log(logMessage.trim()); // Также выводим в консоль для удобства
  }

  error(message: string): void {
    const errorMessage = `${this.getTimestamp()} [ошибка] ${message}\n`;
    fs.appendFileSync(this.logFilePath, errorMessage);
    console.error(errorMessage.trim()); // Также выводим в консоль для удобства
  }
}