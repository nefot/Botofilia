import { ChatService } from '../../core/services/ChatService';
import { MinecraftBot } from '../../core/entities/MinecraftBot';

/**
 * Контроллер для управления ботом Minecraft.
 */
export class MinecraftBotController {
    constructor(private chatService: ChatService) {}

    /**
     * Регистрирует обработчик событий чата для бота.
     *
     * @param {MinecraftBot} bot - Экземпляр MinecraftBot.
     */
    registerChatHandler(bot: MinecraftBot): void {
        bot.bot.on('chat', async (username, message) => {
            await this.chatService.handleChatMessage(bot.username, username, message);
        });
    }
}
