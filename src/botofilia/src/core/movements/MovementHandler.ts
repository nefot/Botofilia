// core/movements/MovementHandler.ts
import {MinecraftBot} from '../entities/MinecraftBot';
import {IMovementHandler} from '../interfaces/MovementHandler';
import {goals, Movements, pathfinder} from 'mineflayer-pathfinder';
import {ILogger} from '../interfaces/Logger';
import {Vec3} from 'vec3';

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

    /**
     * Заставляет бота идти к блоку с указанными координатами.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     * @param {string} x - Координата X блока.
     * @param {string} y - Координата Y блока.
     * @param {string} z - Координата Z блока.
     * @param username
     * @param other
     */

    coordinate(bot: MinecraftBot, x: string, y: string, z: string) {
        const _x: number = x === "~" ? bot.bot.entity.position.x : Number(x);
        const _y: number = y === "~" ? bot.bot.entity.position.y : Number(y);
        const _z: number = z === "~" ? bot.bot.entity.position.z : Number(z);
        return {_x, _y, _z};
    }


    gotoBlock(bot: MinecraftBot, x: string, y: string, z: string, username: string, ...other: string[]): string | undefined {


        const {_x, _y, _z} = this.coordinate(bot, x, y, z);
        const _target = bot.bot.players[username] ? bot.bot.players[username].entity : null;

        if (isNaN(_x) || isNaN(_y) || isNaN(_z)) {
            const errorMessage = `Неверные координаты: ${_x} ${_y} ${_z}`;
            console.error(errorMessage);
            return errorMessage;
        }

        bot.bot.loadPlugin(pathfinder);
        const movements = new Movements(bot.bot);
        bot.bot.pathfinder.setMovements(movements);
        bot.bot.pathfinder.setGoal(new GoalNear(_x, _y, _z, 1));


        console.log(`Бот идет в координаты: ${_x}, ${_y}, ${_z}`);
        bot.bot.once('goal_reached', (): void => {
            console.log(username, `Достигнутые координаты: ${_x} ${_y} ${_z}`);
        });
    }

    blockPlace(bot: MinecraftBot, x: string, y: string, z: string, username: string, blockName: string, ...other: string[]): string | void {

        console.log(x, y, z)
        this.placeBlock(bot, x, y, z, blockName, username);

    }

    /**
     * Заставляет бота поставить блок.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     * @param {string} _x - Координата X блока.
     * @param {string} _y - Координата Y блока.
     * @param {string} _z - Координата Z блока.
     * @param {string} blockName - Имя блока, который нужно поставить.
     * @param username
     */
    async placeBlock(bot: MinecraftBot, _x: string, _y: string, _z: string, blockName: string, username: string) {
        try {
            const {_x: x, _y: y, _z: z} = this.coordinate(bot, _x, _y, _z);

            const blockPos = new Vec3(x, y, z);
            const referenceBlock = bot.bot.blockAt(blockPos);

            if (!referenceBlock) {
                this.logger.logEvent(`Блок не найден по координатам: ${x}, ${y}, ${z}`);
                return;
            }

            // Проверяем, находится ли бот на позиции, где нужно разместить блок
            const botPos = bot.bot.entity.position.floored(); // Текущая позиция бота, округленная до блока

            if (botPos.equals(blockPos)) {
                // Если бот стоит на месте установки блока, перемещаем его немного в сторону
                const safeMovePos = blockPos.plus(new Vec3(1, 0, 0)); // Сдвигаем бота на 1 блок вправо
                this.logger.logEvent(`Бот стоит на месте установки блока. Перемещаем бота в безопасное место: ${safeMovePos}`);

                this.gotoBlock(bot, String(safeMovePos.x), String(safeMovePos.y), String(safeMovePos.z), username);
                await new Promise((resolve) => bot.bot.once('goal_reached', resolve)); // Ждём, пока бот переместится
            }


            // Идем к блоку
            this.gotoBlock(bot, String(x), String(y), String(z), username);

            // Ждем, пока бот дойдет до цели
            await new Promise((resolve) => bot.bot.once('goal_reached', resolve));

            // Ставим блок
            await bot.bot.placeBlock(referenceBlock, new Vec3(0, 1, 0));

            this.logger.logEvent(`Блок ${blockName} успешно размещен рядом с блоком на ${x}, ${y}, ${z}`);
        } catch (error) {
            this.logger.logEvent(`Ошибка при установке блока: ${error}`);
        }
    }
}


