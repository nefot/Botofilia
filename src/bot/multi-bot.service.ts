import { Injectable } from '@nestjs/common';
import { Bot, createBot, BotOptions } from 'mineflayer';
import { BotFactory } from './bot.factory';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MultiBotService {
  private readonly bots = new Map<string, Bot>();

  constructor(
    private readonly botFactory: BotFactory,
    private readonly logger: LoggerService
  ) {}

 create(username: string, password: string, host: string, port: number): Bot {
  const bot = this.botFactory.create({ username, password, host, port });
  this.bots.set(username, bot);
  return bot;
}


  get(name: string): Bot | undefined {
    return this.bots.get(name);
  }

  getAll(): string[] {
    return Array.from(this.bots.keys());
  }
}
