import { MinecraftBot } from '../entities/MinecraftBot';
import { MovementHandler } from '../movements/MovementHandler';

export class ChatHandler {
    constructor(private movementHandler: MovementHandler) {}

    /**
     * Обрабатывает сообщение чата.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     * @param {string} username - Имя пользователя, отправившего сообщение.
     * @param {string} message - Сообщение.
     */
    handleMessage(bot: MinecraftBot, username: string, message: string): void {
        if (message === 'jump') {
            this.movementHandler.jump(bot);
        }
    }
}
