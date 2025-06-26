import { Injectable } from '@nestjs/common';
import { Bot } from 'mineflayer';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { ICommandHandler } from '../interfaces/command-handler.interface';

const { GoalNear } = goals;

@Injectable()
export class MoveCommandHandler implements ICommandHandler {
  async execute(args: string[], bot: Bot): Promise<void> {
    if (!bot.hasPlugin(pathfinder)) {
      bot.loadPlugin(pathfinder);
    }

    if (args.length < 3) {
      bot.chat('Недостаточно аргументов. Укажите x y z.');
      return;
    }

    const [x, y, z] = args.map(Number);

    if ([x, y, z].some((v) => isNaN(v))) {
      bot.chat('Координаты должны быть числами.');
      return;
    }

    const customMoves = new Movements(bot);
    bot.pathfinder.setMovements(customMoves);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));

    bot.once('goal_reached', () => {
      bot.chat(`Достиг цели (${x}, ${y}, ${z})`);
    });

    bot.once('path_reset', () => {
      bot.chat('Путь сброшен, движение отменено.');
    });
  }
}
