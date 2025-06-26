import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotFactory } from './bot.factory';
import { MultiBotService } from './multi-bot.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [BotService, BotFactory, MultiBotService],
  exports: [BotService, MultiBotService],
})
export class BotModule {}
