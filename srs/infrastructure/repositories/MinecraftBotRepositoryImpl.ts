import { IMinecraftBotRepository } from '../../core/interfaces/MinecraftBotRepository';
import { MinecraftBot } from '../../core/entities/MinecraftBot';

export class MinecraftBotRepositoryImpl implements IMinecraftBotRepository {
    private bots: Map<string, MinecraftBot> = new Map();

    async findById(id: string): Promise<MinecraftBot | null> {
        return this.bots.get(id) || null;
    }

    async save(bot: MinecraftBot): Promise<void> {
        this.bots.set(bot.username, bot);
    }

    async delete(id: string): Promise<void> {
        this.bots.delete(id);
    }
}
