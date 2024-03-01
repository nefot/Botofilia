import * as mineflayer from 'mineflayer';
import clc from "cli-color";

class MovementController {
    private bot: mineflayer.Bot;

    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
    }

    public gotoBlock(x: string, y: string, z: string, username:string) {
        // const _x:number = Number(x)
        // const _y:number = Number(y);
        // const _z:number  = Number(z);
        // const _target = this.bot.players[username] ? this.bot.players[username].entity : null
        // // Реализация перемещения к игроку
        // console.log('Bot is going to player...');
        // // Дополнительные действия, например, перемещение бота к игроку
        //
        //
        // if (isNaN(_x) || isNaN(_y) || isNaN(_z)) {
        //     this.bot.chat(`/msg ${_target} неправильно введены координаты ${_x} ${_y} ${_z}`);
        // }
        // else {
        //     this.bot.pathfinder.setGoal(new GoalNear(_x, _y, _z, 1));
        //     this.bot.chat(`/msg ${_target} Иду в координаты ${_x} ${_y} ${_z}`);
        //     console.log(clc.blue('Иду в координаты', _x, _y, _z));
        // }
        
    }

    public comeToPlayer() {
        // Реализация перемещения к игроку
        console.log('Bot is coming to player...');
        // Дополнительные действия, например, перемещение бота к игроку
    }

    // Добавьте другие методы для управления движениями бота, если это необходимо
}

export {MovementController};
