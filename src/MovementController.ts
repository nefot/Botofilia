import * as mineflayer from 'mineflayer';
import { ChatController } from './ChatController';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import {Terminal} from './terminal';
const { GoalNear, GoalFollow } = goals;

class MovementController {
    private bot: mineflayer.Bot;
    private chat: ChatController;
    private t: Terminal;

    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
        bot.loadPlugin(pathfinder);
        this.chat = new ChatController(this.bot, '');
        this.t = new  Terminal()
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.bot.on('goal_reached', () => {
            this.t.printMessage('Goal reached');
            // Add any actions needed when the goal is reached
        });
    }

    public gotoBlock(x: string, y: string, z: string, username: string): string {
        const _x: number = Number(x);
        const _y: number = Number(y);
        const _z: number = Number(z);
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null;

        if (isNaN(_x) || isNaN(_y) || isNaN(_z)) {
            const errorMessage = `Invalid coordinates: ${x} ${y} ${z}`;
            this.chat.sendDirectMessage(username, errorMessage);
            console.error(errorMessage);
            return errorMessage;
        }

        this.bot.pathfinder.setGoal(new GoalNear(_x, _y, _z, 0));
        const defaultMove = new Movements(this.bot);
        const path = this.bot.pathfinder.getPathTo(defaultMove, new GoalNear(_x, _y, _z, 0));

        this.t.printMessage(`Bot is going to coordinates:, ${_x}, ${_y}, ${_z}`);
        this.chat.sendDirectMessage(username, `Going to coordinates: ${_x} ${_y} ${_z}`);
        return `Going to coordinates: ${_x} ${_y} ${_z}`;
    }

    public stopBot(username: string): string {
        this.bot.pathfinder.setGoal(null);
        const message = 'Stopping';
        this.chat.sendDirectMessage(username, message);
        this.t.printMessage(message);
        return message;
    }

    public comeToPlayer(username: string): string {
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null;

        if (_target) {
            this.bot.pathfinder.setGoal(new GoalFollow(_target, 1), true);
            const message = 'Coming to player';
            this.chat.sendDirectMessage(username, message);
            this.t.printMessage(message);
            return message;
        } else {
            const errorMessage = `Unable to find entity for player: ${username}`;
            this.chat.sendDirectMessage(username, errorMessage);
            console.error(errorMessage);
            return errorMessage;
        }
    }
}

export { MovementController };
