import { MinecraftBot } from '../entities/MinecraftBot';

export interface IMinecraftBotRepository {
    findById(id: string): Promise<MinecraftBot | null>;
    save(bot: MinecraftBot): Promise<void>;
    delete(id: string): Promise<void>;
}
