import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Bot } from 'mineflayer';
import { BotFactory } from './bot.factory';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class BotService implements OnModuleDestroy {
  private bot: Bot;

  constructor(
    private readonly botFactory: BotFactory,
    private readonly logger: LoggerService,
  ) {
  }

  async init(username: string, password: string, host: string, port: number) {
    this.bot = this.botFactory.create({
      host,
      port,
      username,
      password,
    });

    this.registerEvents();
  }

  getBot(): Bot {
    return this.bot;
  }

  onModuleDestroy() {
    this.bot?.end?.();
  }

  private registerEvents() {
    this.bot.on('login', () =>
    {
      this.logger.log(this.bot.username, 'Bot logged in');
      this.bot.chat(`/register ${this.bot.username} ${this.bot.username}`);

      setTimeout(() =>
      {
        this.bot.chat(`/login ${this.bot.username}`);
      }, 1000);
    });

    this.bot.on('end', () =>
    {
      this.logger.warn(this.bot.username, 'Bot disconnected');
    });

    this.bot.on('message', (msg) =>
    {
      this.logger.log(this.bot.username, `Chat: ${msg.toString()}`);
    });
  }
}
