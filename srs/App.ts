import mineflayer from 'mineflayer';
import { MinecraftBotRepositoryImpl } from './infrastructure/repositories/MinecraftBotRepositoryImpl';
import { MinecraftBotController } from './ui/controllers/MinecraftBotController';
import { ChatService } from './core/services/ChatService';
import { ChatHandler } from './core/handlers/ChatHandler';
import { MovementHandler } from './core/movements/MovementHandler';
import { LoggerService } from './core/services/LoggerService';
import { ReconnectServiceImpl } from './core/services/ReconnectServiceImpl';
import { MinecraftBotDTO } from './core/dtos/MinecraftBotDTO';
import { MinecraftBot } from './core/entities/MinecraftBot';

export class App {
    private botRepository: MinecraftBotRepositoryImpl;
    private movementHandler: MovementHandler;
    private chatService: ChatService;
    private chatHandler: ChatHandler;
    private loggerService: LoggerService;
    private botController: MinecraftBotController;
    private reconnectService: ReconnectServiceImpl;

    constructor() {
        this.loggerService = new LoggerService();
        this.movementHandler = new MovementHandler();
        this.chatHandler = new ChatHandler(this.loggerService, this.movementHandler);
        this.botRepository = new MinecraftBotRepositoryImpl();
        this.chatService = new ChatService(this.botRepository, this.chatHandler);
        this.botController = new MinecraftBotController(this.chatService);
        this.reconnectService = new ReconnectServiceImpl(this.botRepository, this.botController);
    }

    async start(): Promise<void> {
        const botDTO = new MinecraftBotDTO(
            process.argv[2],
            process.argv[3],
            process.argv[4],
            process.argv[5] === "true",
            parseInt(process.argv[6]),
            {}
        );

        const bot = await this.createMinecraftBot(botDTO);

        await this.botRepository.save(bot);
        this.botController.registerChatHandler(bot);

        const retrievedBot = await this.botRepository.findById(botDTO.username);
        if (retrievedBot) {
            console.log(`Bot ${retrievedBot.username} retrieved successfully.`);
        } else {
            console.log('Bot not found.');
        }

        bot.bot.on('spawn', () => {
            console.log(`Bot ${botDTO.username} retrieved successfully.`);
        });
    }

    private createMinecraftBot(botDTO: MinecraftBotDTO): Promise<MinecraftBot> {
        return new Promise((resolve, reject) => {
            try {
                const bot = new MinecraftBot(
                    botDTO.username,
                    botDTO.password,
                    mineflayer.createBot(botDTO),
                    botDTO.host,
                    botDTO.chat_logger,
                    botDTO.port,
                    botDTO.options
                );
                resolve(bot);
            } catch (error) {
                reject(error);
            }
        });
    }
}
