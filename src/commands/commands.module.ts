import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { MoveCommandHandler } from './handlers/move.handler';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  providers: [
    CommandService,
    MoveCommandHandler,

  ],
  exports: [CommandService],
})
export class CommandsModule {}
