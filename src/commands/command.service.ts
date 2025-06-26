import { Injectable } from '@nestjs/common';
import { MoveCommandHandler } from './handlers/move.handler';
import { BotService } from '../bot/bot.service';
import { ICommandHandler } from './interfaces/command-handler.interface';
import { Bot } from 'mineflayer';

@Injectable()
export class CommandService {
  private readonly commands: Record<string, ICommandHandler>;

  constructor(
    private readonly moveHandler: MoveCommandHandler,
    private readonly botService: BotService,
  ) {
    this.commands = {
      move: this.moveHandler,
      // другие команды можно добавлять сюда
    };
  }

  async execute(rawCommand: string, bot: Bot): Promise<void> {
    const [cmd, ...args] = rawCommand.trim().split(/\s+/);
    const handler = this.commands[cmd];

    if (!handler)
      {
        bot.chat(`Неизвестная команда: ${cmd}`);
        return;
      }

    await handler.execute(args, bot);
  }

}
