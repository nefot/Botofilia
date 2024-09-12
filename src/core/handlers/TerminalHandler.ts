import { ITerminalHandler } from '../interfaces/TerminalHandler';
import { IMovementHandler } from '../interfaces/MovementHandler';
import { IMinecraftBotRepository } from '../interfaces/MinecraftBotRepository';

export class TerminalHandler implements ITerminalHandler {
    constructor(
        private movementHandler: IMovementHandler,
        private botRepository: IMinecraftBotRepository
    ) {}

    async handleCommand(command: string): Promise<void> {
        const [action, username] = command.split(' ');

        const bot = await this.botRepository.findById(username);
        if (!bot) {
            console.log(`Bot ${username} not found`);
            return;
        }
        console.log(action,username);
        switch (action) {
            case 'jump':
                this.movementHandler.jump(bot);
                break;
            case 'follow':
                this.movementHandler.followPlayer(bot, username);
                break;
            case 'stop':
                this.movementHandler.stop(bot);
                break;
            default:
                console.log(`Unknown command: ${command}`);
        }
    }
}
