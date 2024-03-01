import * as mineflayer from 'mineflayer';
// import {BlockCleaner} from "./BlockCleaner";
import {MovementController} from './MovementController';
import {ChatController} from './ChatController';
// import {EventController} from './EventController';
import chalk from 'chalk';
import clc from "cli-color";

import net from "net";

class MinecraftBot {


    private readonly bot: mineflayer.Bot;
    private readonly password: string;
    private readonly username: string;
    private movementController: MovementController;
    private chat: ChatController;
    // private eventController: EventController;
    private controller_port: number;
    private controller_host: string;


    constructor(username: string, password: string, host: string, options?: any) {
        this.bot = mineflayer.createBot({
            username: username,
            password: password,
            host: host,

            ...options,
        });
        this.movementController = new MovementController(this.bot);
        this.chat = new ChatController(this.bot, password, username);
        // this.eventController = new EventController(this.bot);
        this.username = username;
        this.password = password;



        this.controller_port = 7777;
        this.controller_host = 'localhost';




        this.setupEvents()
    }

    private run_server_controller() {
        const server: net.Server = net.createServer((socket: net.Socket) => {
            console.log('Клиент подключен');

            socket.on('data', (data: Buffer) => {
                const command: string = data.toString().trim();
                console.log('Получена команда:', command);

                // Обработка команды, например:
                // handleCommand(command);
            });

            socket.on('end', () => {
                console.log('Клиент отключен');
            });
        });

        server.on('error', (err: NodeJS.ErrnoException) => {
            console.error('Ошибка сервера:', err);
        });

        server.listen(this.controller_port, () => {
            console.log(`Сервер запущен на порту ${this.controller_port}`);
        });

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
    private setupEvents() {

        this.bot.on('spawn', () => {
            console.log('Bot spawned!');
        });

        this.bot.on('playerJoined', (player) => {
            console.log(`${player.username} присоединился к игре`);
        });

        this.bot.on("death",async ()=>{
            console.log(("СМЕРТЬ"))
            // stop()
        })
        this.bot.on('playerLeft', async (username) => {
            console.log((`${username.displayName} вышел из игры`));
        });

        this.bot.on('whisper', (username, message, translate, jsonMsg, matches) => {
            this.chat.handleChatMessage(username, message);
            console.log((` ${this.chat.getCurrentDateTime()} <${username}> ${message}`));
        });
    }
    // Add other methods as need edt
}


// Пример использования:
const bot = new MinecraftBot(process.argv[2], process.argv[3], process.argv[4], process.argv[5] ? process.argv[5] : NaN );
