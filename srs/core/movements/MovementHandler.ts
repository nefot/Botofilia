import { MinecraftBot } from '../entities/MinecraftBot';

export class MovementHandler {
    /**
     * Заставляет бота прыгнуть.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     */
    jump(bot: MinecraftBot): void {
        bot.bot.setControlState('jump', true);
        setTimeout(() => {
            bot.bot.setControlState('jump', false);
        }, 1000);
    }
}
