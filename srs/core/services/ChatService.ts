import { MinecraftBotRepository } from '../interfaces/MinecraftBotRepository';
import { ChatHandler } from '../handlers/ChatHandler';

export class ChatService {
    constructor(
        private botRepository: MinecraftBotRepository,
        private chatHandler: ChatHandler
    ) {}

    /**
     * Обрабатывает сообщение чата.
     *
     * @param {string} botId - Идентификатор бота.
     * @param {string} username - Имя пользователя, отправившего сообщение.
     * @param {string} message - Сообщение.
     */
    async handleChatMessage(botId: string, username: string, message: string): Promise<void> {
        const bot = await this.botRepository.findById(botId);
        if (bot) {
            this.chatHandler.handleMessage(bot, username, message);
        }
    }
}
