import * as mineflayer from 'mineflayer';
import {ChatController} from './ChatController';
import {pathfinder, Movements, goals} from 'mineflayer-pathfinder';
import {Terminal} from './terminal';

const {GoalNear, GoalFollow} = goals;
import * as fs from 'fs';
import * as path from 'path';

import movement from 'mineflayer-movement';


interface IMovementController {
    gotoBlock(x: number, y: number, z: number, username: string): string;

    comeToPlayer(username: string): string;

    stopBot(username: string): string;
}


class MovementController {
    private bot: mineflayer.Bot;
    private chat: ChatController;
    private t: Terminal;
    private deathPoint: { x: number, y: number, z: number } | null = null;
    private logDir: string = path.join(__dirname, 'Death');
    private logFilePath: string = path.join(this.logDir, 'Death.log');
    private lastDamageSource: string | null = null;


    constructor(bot: mineflayer.Bot, chat: ChatController, terminal: Terminal) {
        this.bot = bot;
        this.chat = chat;
        this.t = terminal;
        this.bot.loadPlugin(pathfinder);
        bot.loadPlugin(movement.plugin);


        this.setupEventHandlers();
        this.ensureLogDirectory();
    }

    private setupEventHandlers(): void {
        this.bot.on('goal_reached', () => {
            this.t.printMessage('Цель достигнута');
        });

        this.bot.once("login", () => {
            // load heuristics with default configuration
            const {Default} = this.bot.movement.goals;
            this.bot.movement.setGoal(Default);
            // set control states
            this.bot.setControlState("forward", true);
            this.bot.setControlState("sprint", true);
            this.bot.setControlState("jump", true);
        });


        this.bot.on('death', () => {
            if (this.bot.entity.position) {
                this.deathPoint = {
                    x: this.bot.entity.position.x,
                    y: this.bot.entity.position.y,
                    z: this.bot.entity.position.z
                };
                const deathMessage = `Точка смерти сохранена: x=${this.deathPoint.x}, y=${this.deathPoint.y}, z=${this.deathPoint.z}`;
                console.log(deathMessage);
                this.t.printMessage(deathMessage);

                // Добавление данных о смерти в лог-файл
                const dimension = this.bot.game.dimension;
                const date = new Date().toISOString();

                const logMessage = `[${date}] {${this.bot.entity.username}} Dimension: ${dimension}, Coordinates: x=${this.deathPoint.x}, y=${this.deathPoint.y}, z=${this.deathPoint.z}\n`;

                fs.appendFile(this.logFilePath, logMessage, (err) => {
                    if (err) {
                        console.error('Ошибка при записи в лог-файл', err);
                    } else {
                        console.log('Информация о смерти сохранена в лог-файл');
                    }
                });
            }
        });
    }

    private ensureLogDirectory(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, {recursive: true});
        }
    }

    public gotoBlock(x: string, y: string, z: string, username: string, ...other: string[]): string | undefined {
        const _x: number = x == "~" ? this.bot.entity.position.x : Number(x);
        const _y: number = y == "~" ? this.bot.entity.position.y : Number(y)
        const _z: number = z == "~" ? this.bot.entity.position.z : Number(z)
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null;

        if (isNaN(_x) || isNaN(_y) || isNaN(_z)) {
            const errorMessage = `Неверные координаты: ${x} ${y} ${z}`;
            this.chat.sendDirectMessage(username, errorMessage);
            console.error(errorMessage);
            return errorMessage;
        }



        this.bot.pathfinder.setGoal(new GoalNear(_x, _y, _z, 1));
        const defaultMove: Movements = new Movements(this.bot);
        const path = this.bot.pathfinder.getPathTo(defaultMove, new GoalNear(_x, _y, _z, 1));

        this.t.printMessage(`Бот идет в координаты: ${_x}, ${_y}, ${_z}`);
        this.chat.sendDirectMessage(username, `Бот идет в координаты: ${_x} ${_y} ${_z}`);
        this.bot.once('goal_reached', (): void => {
            this.t.printMessage(`Pathfinder достиг цели по координатам: ${_x}, ${_y}, ${_z}`);
            this.chat.sendDirectMessage(username, `Достигнутые координаты: ${_x} ${_y} ${_z}`);
        });

    }

    public stopBot(username: string): string {
        this.bot.pathfinder.setGoal(null);
        const message = 'Остановка';
        this.chat.sendDirectMessage(username, message);
        this.t.printMessage(message);
        return message;
    }

    public comeToPlayer(username: string): string {
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null;

        if (_target) {
            this.bot.pathfinder.setGoal(new GoalFollow(_target, 1), true);
            const message: string = 'Следование за игроком';
            this.chat.sendDirectMessage(username, message);
            this.t.printMessage(message);
            return message;
        } else {
            const errorMessage: string = `Не удалось найти объект для игрока: ${username}`;
            this.chat.sendDirectMessage(username, errorMessage);
            console.error(errorMessage);
            return errorMessage;
        }
    }
}

export {MovementController};
