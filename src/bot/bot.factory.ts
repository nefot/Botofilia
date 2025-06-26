import { Injectable } from '@nestjs/common';
import { Bot, createBot, BotOptions } from 'mineflayer';

@Injectable()
export class BotFactory {
  create(options: BotOptions): Bot {
    return createBot({
      ...options,
      version: '1.21.4',
    });
  }
}
