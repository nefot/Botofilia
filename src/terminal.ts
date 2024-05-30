import * as readline from 'readline';

export class Terminal {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        this.rl.on('line', (input: string) => {
            this.handleInput(input);
        });

        this.rl.on('close', () => {
            console.log('Terminal closed.');
            process.exit(0);
        });
    }

    private handleInput(input: string): void {
        console.log(`Received command: ${input}`);
        // Process the command here
        if (input === 'exit') {
            this.rl.close();
        } else {
            // Handle other commands
            console.log(`Command '${input}' is not recognized.`);
        }
    }

    public printMessage(message: string): void {
        console.log(message);
    }

    public prompt(): void {
        this.rl.prompt();
    }
}

const terminal = new Terminal();
terminal.printMessage('Welcome to the terminal!');
terminal.prompt();
