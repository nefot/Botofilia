import mineflayer from 'mineflayer';
import {Vec3} from "vec3";
import {pathfinder, Movements, goals} from 'mineflayer-pathfinder';

const {GoalNear, GoalFollow, GoalGetToBlock} = goals;

var v = require('vec3');

var v1 = v(1, 2, 3);

class BlockClearer {
    private bot: mineflayer.Bot;
    private distance_to_block: number;


    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
        this.distance_to_block = 6;

    }

    private diging() {

    }


    private moveToBlock(x: number, y: number, z: number): boolean {
        let current_pos = this.bot.entity.position
        console.log(current_pos, ' : current_pos')


        // this.bot.entity.position.offset(x,y,z)
        this.bot.pathfinder.setGoal(new GoalGetToBlock(x, y, z));
        let block = this.bot.blockAt(new Vec3(x, y, z))
        if (block !== null) {
            this.bot.dig(block), function () {
                console.log('done');
            }
        } else {
            console.log("block == null")
        }

        return true


    }


    public clearRectangle(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        this.moveToBlock(8, -61, 0);


        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);
        const minZ = Math.min(z1, z2);
        const maxX = Math.max(x1, x2);
        const maxY = Math.max(y1, y2);
        const maxZ = Math.max(z1, z2);

        for (let x = minX; x <= maxX; x++) {
            console.log('1')
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    const block = this.bot.blockAt(v(x, y, z));
                    if (block && block.type !== 0) { // Check if block exists and is not air
                        this.moveToBlock(x, y, z)
                        console.log(`x:${x} y:${x} z:${x}`)
                        this.bot.dig(block);

                        // }

                    }
                }
            }
            return 'done'
        }
        return ''
    }
}

export {BlockClearer};
