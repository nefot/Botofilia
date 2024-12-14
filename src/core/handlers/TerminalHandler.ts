import {ITerminalHandler} from '../interfaces/TerminalHandler';
import {IMovementHandler} from '../interfaces/MovementHandler';
import {IMinecraftBotRepository} from '../interfaces/MinecraftBotRepository';

export class TerminalHandler implements ITerminalHandler {
    constructor(
        private movementHandler: IMovementHandler,
        private botRepository: IMinecraftBotRepository
    ) {
    }

    async handleCommand(command: string): Promise<void> {
        const [username, action] = command.split(' ');

        const bot = await this.botRepository.findById(username);
        if (!bot) {
            console.log(`Bot ${username} not found`);
            return;
        }
        console.log(action, username);
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
            case 'gotoBlock':
                this.movementHandler.gotoBlock(bot, (command.split(' ')[2]), (command.split(' ')[3]), (command.split(' ')[4]), username)
                break;

            case 'blockPlace':
                this.movementHandler.blockPlace(bot, (command.split(' ')[2]), (command.split(' ')[3]), (command.split(' ')[4]), command.split(' ')[5], username)
                break;

            default:
                console.log(`Unknown command: ${command}`);
        }
    }
}
