import * as mineflayer from 'mineflayer';
// import {BlockCleaner} from "./BlockCleaner";
import {MovementController} from './MovementController';
import {ChatController} from './ChatController';
import {EventController} from './EventController';
import chalk from 'chalk';


class MinecraftBot {
    private readonly bot: mineflayer.Bot;
    private readonly password: string;
    private readonly username: string;
    private movementController: MovementController;
    private chat: ChatController;
    private eventController: EventController;


    constructor(username: string, password: string, host: string, options?: any) {
        this.bot = mineflayer.createBot({
            username: username,
            password: password,
            host: host,

            ...options,
        });
        this.movementController = new MovementController(this.bot);
        this.chat = new ChatController(this.bot, password, username);
        this.eventController = new EventController(this.bot);
        this.username = username;
        this.password = password;
    }


    public handleChatMessage(message: string): void {
        message = message.toLowerCase().split(" ")[0]
        switch (message) {
            case 'goto':
                this.movementController.gotoBlock(message[1],message[2],message[3],'');
                break;
            case 'come':
                this.movementController.comeToPlayer();
                break;
            default:
                // Действие по умолчанию для неизвестных сообщений
                break;
        }
    }
    // Add other methods as need edt
}


// Пример использования:
const bot = new MinecraftBot(process.argv[2], process.argv[3], process.argv[4], process.argv[5] ? process.argv[5] : NaN );
