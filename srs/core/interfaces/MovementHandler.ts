// core/interfaces/MovementHandler.ts
import {MinecraftBot} from '../entities/MinecraftBot';

export interface IMovementHandler {

    jump(bot: MinecraftBot): void;

    followPlayer(bot: MinecraftBot, username: string): void;

    stop(bot: MinecraftBot): void;

    gotoBlock(bot: MinecraftBot, x: number, y: number, z: number): void;



}
