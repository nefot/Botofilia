import * as mineflayer from 'mineflayer';
import clc from "cli-color";
import {ChatController} from './ChatController';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
const { GoalNear, GoalBlock, GoalFollow } = goals;


class MovementController {
    private bot: mineflayer.Bot;
    private chat: ChatController;




    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
        bot.loadPlugin(pathfinder);
        this.chat = new ChatController(this.bot);

    }

    public  gotoBlock(x: string, y: string, z: string, username:string) {
        console.log(x,y,z)
        const _x:number = Number(x)
        const _y:number = Number(y);
        const _z:number  = Number(z);
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null
        // Реализация перемещения к игроку
        console.log('Bot is going to player...');
        // Дополнительные действия, например, перемещение бота к игроку


        let path;
        if (isNaN(_x) || isNaN(_y) || isNaN(_z)) {
            // this.chat.sendDirectMessage(username, `неправильно введены координаты ${_x} ${_y} ${_z}`)
            console.log(`неправильно введены координаты ${_x} ${_y} ${_z}`)
            return `неправильно введены координаты ${_x} ${_y} ${_z}`
        } else {
            this.bot.pathfinder.setGoal(new GoalNear(_x, _y, _z, 0));
            const defaultMove = new Movements(this.bot)
            path = this.bot.pathfinder.getPathTo(defaultMove, new GoalNear(_x, _y, _z, 0))
            // console.log(path)
            // this.chat.sendDirectMessage(username, `Иду в координаты ${_x} ${_y} ${_z}`)
            console.log('Иду в координаты', _x, _y, _z);
            this.events()
            return `Иду в координаты ${_x} ${_y} ${_z}`
        }

    }
    public stopBot(username:string){
        this.bot.pathfinder.setGoal(null);
        this.chat.sendDirectMessage(username, `I stopping`)
        return `I stopping`
    }

    public comeToPlayer(username: string) {
        const _target = this.bot.players[username] ? this.bot.players[username].entity : null;
        console.log(_target, " : _target")
        if (_target !== null && _target !== undefined) {
            this.chat.sendDirectMessage(username, `I coming`)
            console.log('Bot is coming to player...');

            this.bot.pathfinder.setGoal(new GoalFollow(_target, 1), true);

            return `I coming`
        } else {
            console.log(`Unable to find entity for player ${username}`);
            this.chat.sendDirectMessage(username, `I dont see you`)
            return `I dont see you`

        }
    }

    public events(){
        this.bot.on('goal_reached', ()=>{
            console.log('дошел')
        })
    }

    // Добавьте другие методы для управления движениями бота, если это необходимо
}

export {MovementController};
