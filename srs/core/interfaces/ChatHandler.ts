import { MinecraftBot } from '../entities/MinecraftBot';

export interface IChatHandler {
    handleMessage(bot: MinecraftBot, username: string, message: string): void;
}
