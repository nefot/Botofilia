// import * as mineflayer from 'mineflayer';
// import clc from "cli-color";
// import {MovementController} from './MovementController';
// import {ChatController} from './ChatController';
// import chalk from "chalk";
//
//
// export class EventController {
//     private readonly bot: mineflayer.Bot;
//     private movementController: MovementController;
//     private chat: ChatController;
//
//
//     constructor(bot: mineflayer.Bot) {
//         this.bot = bot;
//         this.setupEvents();
//         this.movementController = new MovementController(this.bot);
//
//     }
//
//     private setupEvents() {
//         // this.bot.on('chat', (username, message) => {
//         //     console.log(`<${username}> ${message}`);
//         // });
//
//         this.bot.on('spawn', () => {
//             console.log('Bot spawned!');
//         });
//
//         this.bot.on('playerJoined', (player) => {
//             console.log(`${player.username} присоединился к игре`);
//         });
//
//         this.bot.on("death",async ()=>{
//             console.log(("СМЕРТЬ"))
//             // stop()
//         })
//         this.bot.on('playerLeft', async (username) => {
//             console.log(clc.green(`${username.displayName} вышел из игры`));
//         });
//
//         this.bot.on('whisper', function (username, message, translate, jsonMsg, matches) {
//             examination(username, message);
//             console.log(clc.cyan(` ${getCurrentDateTime()} <${username}> ${message}`));
//         });
//     }
// }
