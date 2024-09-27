import readline from 'readline';
import { ITerminalHandler } from '../interfaces/TerminalHandler';

export class TerminalService {
    private terminalHandler: ITerminalHandler;

    constructor(terminalHandler: ITerminalHandler) {
        this.terminalHandler = terminalHandler;
    }

    startListening(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (input: string) => {
            this.terminalHandler.handleCommand(input);
        });
    }
}
