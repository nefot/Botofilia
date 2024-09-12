import { MinecraftBotDTO } from '../dtos/MinecraftBotDTO';

export interface IReconnectService {
    connectBot(botDTO: MinecraftBotDTO): Promise<void>;
    reconnectBot(botDTO: MinecraftBotDTO): Promise<void>;
}
