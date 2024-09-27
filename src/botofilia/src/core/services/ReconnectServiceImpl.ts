import {IReconnectService} from '../interfaces/ReconnectService';
import {MinecraftBotDTO} from '../dtos/MinecraftBotDTO';
import {IMinecraftBotRepository} from '../interfaces/MinecraftBotRepository';
import {MinecraftBotController} from '../../ui/controllers/MinecraftBotController';
import {MinecraftBot} from '../entities/MinecraftBot';
import mineflayer from 'mineflayer';

export class ReconnectServiceImpl implements IReconnectService {
    constructor(
        private botRepository: IMinecraftBotRepository,
        private botController: MinecraftBotController
    ) {
    }

    async connectBot(botDTO: MinecraftBotDTO): Promise<void> {
        const bot = this.createMinecraftBot(botDTO);
        await this.botRepository.save(bot);
        this.botController.registerChatHandler(bot);
    }

    async reconnectBot(botDTO: MinecraftBotDTO): Promise<void> {
        const existingBot = await this.botRepository.findById(botDTO.username);
        if (existingBot) {
            await this.botRepository.delete(botDTO.username);
        }
        await this.connectBot(botDTO);
    }

    private createMinecraftBot(botDTO: MinecraftBotDTO): MinecraftBot {
        const bot = mineflayer.createBot({
            host: botDTO.host,
            port: botDTO.port,
            username: botDTO.username,
            password: botDTO.password,
            ...botDTO.options,
        });

        return new MinecraftBot(
            botDTO.username,
            botDTO.password,
            bot,
            botDTO.host,
            botDTO.chat_logger,
            botDTO.port,
            botDTO.options
        );
    }
}
