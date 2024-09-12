import { TerminalService } from '../../core/services/TerminalService';
import { TerminalHandler } from '../../core/handlers/TerminalHandler';

export class TerminalController {
    private terminalService: TerminalService;

    constructor(terminalHandler: TerminalHandler) {
        this.terminalService = new TerminalService(terminalHandler);
    }

    startListening(): void {
        this.terminalService.startListening();
    }
}
