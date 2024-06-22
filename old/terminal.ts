import { ChatHandler } from './main';

class Terminal {
    private chatHandler: ChatHandler | null = null;

    constructor() {
    }

    public setChatHandler(chatHandler: ChatHandler): void {
        this.chatHandler = chatHandler;
    }

    public printMessage(message:any): void {
        console.log(String(message));
    }

    public prompt(): void {
        process.stdin.resume(); // Ensure stdin is in read mode
        process.stdout.write("> ");
        process.stdin.on('data', (data) => {
            const input = data.toString().trim();
            if (this.chatHandler) {
                this.chatHandler.handleChatMessage('console', input);
            } else {
                console.error("ChatHandler is not defined.");
            }
            process.stdout.write("> "); // Prompt again after handling input
        });
    }
}

export { Terminal };
