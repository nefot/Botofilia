// core/interfaces/MovementHandler.ts
import {MinecraftBot} from '../entities/MinecraftBot';

export interface IMovementHandler {

    jump(bot: MinecraftBot): void;

    followPlayer(bot: MinecraftBot, username: string): void;

    stop(bot: MinecraftBot): void;

    gotoBlock(bot: MinecraftBot, x: string, y: string, z: string, username: string, ...other: string[]): string | undefined

    blockPlace(bot: MinecraftBot, x: string, y: string, z: string,username: string, blockName: string, ...other: string[]): string | void


}
