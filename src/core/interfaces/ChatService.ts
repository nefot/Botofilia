import { IChatHandler } from './ChatHandler';
import { IMinecraftBotRepository } from './MinecraftBotRepository';

export interface IChatService {
    handleChatMessage(botId: string, username: string, message: string): Promise<void>;
}
