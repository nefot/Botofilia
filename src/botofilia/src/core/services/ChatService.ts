import { IChatService } from '../interfaces/ChatService';
import { IChatHandler } from '../interfaces/ChatHandler';
import { IMinecraftBotRepository } from '../interfaces/MinecraftBotRepository';
import { MinecraftBot } from '../entities/MinecraftBot';

export class ChatService implements IChatService {
    constructor(
        private botRepository: IMinecraftBotRepository,
        private chatHandler: IChatHandler
    ) {}

    async handleChatMessage(botId: string, username: string, message: string): Promise<void> {
        const bot = await this.botRepository.findById(botId);
        if (bot) {
            this.chatHandler.handleMessage(bot, username, message);
        }
    }
}
