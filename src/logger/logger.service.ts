import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { formatDate, ensureDirExists } from './utils/log-utils';

@Injectable()
export class LoggerService {
  private readonly basePath = path.join(__dirname, '..', 'logs');

  private getLogFilePath(botName: string): string {
    const { date, folder } = formatDate();
    const logDir = path.join(this.basePath, folder);
    ensureDirExists(logDir);
    return path.join(logDir, `${botName}_${date}.log`);
  }

  private write(botName: string, level: string, message: string) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${message}`;
    const file = this.getLogFilePath(botName);
    fs.appendFileSync(file, line + '\n', 'utf8');
    console.log(line);
  }

  log(botName: string, message: string) {
    this.write(botName, 'INFO', message);
  }

  warn(botName: string, message: string) {
    this.write(botName, 'WARN', message);
  }

  error(botName: string, message: string) {
    this.write(botName, 'ERROR', message);
  }

  chat(botName: string, from: string, msg: string) {
    this.write(botName, 'CHAT', `<${from}> ${msg}`);
  }

  event(botName: string, event: string) {
    this.write(botName, 'EVENT', event);
  }
}
