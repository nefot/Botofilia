// core/movements/MovementHandler.ts
import {MinecraftBot} from '../entities/MinecraftBot';
import {IMovementHandler} from '../interfaces/MovementHandler';
import {goals, Movements} from 'mineflayer-pathfinder';
import { ILogger } from '../interfaces/Logger';

const {GoalNear, GoalFollow} = goals;

export class MovementHandler implements IMovementHandler {
    constructor(private logger: ILogger) {


    }
    /**
     * Заставляет бота прыгнуть.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     */
    jump(bot: MinecraftBot): void {
        bot.bot.setControlState('jump', true);
        setTimeout(() => {
            bot.bot.setControlState('jump', false);
            this.logger.logEvent(`Bot ${bot.username} jumped.`);
        }, 1000);
    }

    /**
     * Заставляет бота следовать за игроком.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     * @param {string} username - Имя пользователя игрока, за которым нужно следовать.
     */
    followPlayer(bot: MinecraftBot, username: string): void {
        const player = bot.bot.players[username]?.entity;
        if (player) {
            const _target = bot.bot.players[username] ? bot.bot.players[username].entity : null;
            if (_target) {
                bot.bot.pathfinder.setGoal(new GoalFollow(_target, 1), true);
                this.logger.logEvent(`Bot ${bot.username} is following ${player}.`);
            }
        }
    }

    /**
     * Останавливает движение бота.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     */
    stop(bot: MinecraftBot): void {
        bot.bot.pathfinder.setGoal(null);
        this.logger.logEvent(`Bot ${bot.username} stopped.`);
    }

    /**
     *
     * @param {MinecraftBot} bot
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */

    gotoBlock(bot: MinecraftBot, x: number, y: number, z: number) {
        // написать
    }
}
