import { MinecraftBot } from '../entities/MinecraftBot';
import { IChatHandler } from '../interfaces/ChatHandler';
import { ILogger } from '../interfaces/Logger';
import { MovementHandler } from '../movements/MovementHandler';

export class ChatHandler implements IChatHandler {
    constructor(private logger: ILogger ,private movementHandler: MovementHandler) {}

    handleMessage(bot: MinecraftBot, username: string, message: string): void {
        this.logger.logChatMessage(username, message);

        if (message === 'jump') {
            this.movementHandler.jump(bot);
        }
    }
}
