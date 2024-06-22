import { MinecraftBot } from '../entities/MinecraftBot';

/**
 * Интерфейс для репозитория MinecraftBot.
 */
export interface MinecraftBotRepository {
    findById(id: string): Promise<MinecraftBot | null>;
    save(bot: MinecraftBot): Promise<void>;
    delete(id: string): Promise<void>;
}
