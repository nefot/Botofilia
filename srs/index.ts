

import { App } from './App';

async function main(): Promise<void> {
    try {
        const app = new App();
        await app.start();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main().then(() => {
    console.log('The main function completed successfully.');
}).catch((error) => {
    console.error('An error occurred:', error);
});

//
// import mineflayer from 'mineflayer';
// import { MinecraftBotRepositoryImpl } from './infrastructure/repositories/MinecraftBotRepositoryImpl';
// import { MinecraftBot } from './core/entities/MinecraftBot';
// import { MinecraftBotDTO } from './core/dtos/MinecraftBotDTO';
// import { MinecraftBotController } from './ui/controllers/MinecraftBotController';
// import { ChatService } from './core/services/ChatService';
// import { ChatHandler } from './core/handlers/ChatHandler';
// import { MovementHandler } from './core/movements/MovementHandler';
//
// const botRepository: MinecraftBotRepositoryImpl = new MinecraftBotRepositoryImpl();
// const movementHandler: MovementHandler = new MovementHandler();
// const chatHandler: ChatHandler = new ChatHandler(movementHandler);
// const chatService: ChatService = new ChatService(botRepository, chatHandler);
// const botController: MinecraftBotController = new MinecraftBotController(chatService);
//
// function createMinecraftBot(botDTO: MinecraftBotDTO): Promise<MinecraftBot> {
//     return new Promise((resolve, reject) => {
//         try {
//             const bot = new MinecraftBot(
//                 botDTO.username,
//                 botDTO.password,
//                 mineflayer.createBot(botDTO),
//                 botDTO.host,
//                 botDTO.chat_logger,
//                 botDTO.port,
//                 botDTO.options
//             );
//             resolve(bot);
//         } catch (error) {
//             reject(error);
//             console.log('edfgerghrthtyjtyjtj')
//         }
//     });
// }
//
// async function main(): Promise<void> {
//     try {
//         const botDTO: MinecraftBotDTO = new MinecraftBotDTO(
//             process.argv[2],
//             process.argv[3],
//             process.argv[4],
//             process.argv[5] === "true",
//             parseInt(process.argv[6]),
//             {}
//         );
//
//         const bot = await createMinecraftBot(botDTO)
//
//         await botRepository.save(bot);
//         botController.registerChatHandler(bot);
//
//         const retrievedBot: null | MinecraftBot = await botRepository.findById(botDTO.username);
//         if (retrievedBot) {
//             console.log(`Bot ${retrievedBot.username} retrieved successfully.`);
//         } else {
//             console.log('Bot not found.');
//         }
//
//         bot.bot.on('spawn', () => {
//             console.log(`Bot ${botDTO.username} retrieved successfully.`);
//         });
//
//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }
//
// main().then(() => {
//     console.log('The main function completed successfully.');
// }).catch((error) => {
//     console.error('An error occurred:', error);
// });
