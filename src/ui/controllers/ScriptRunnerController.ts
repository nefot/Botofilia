import { ScriptRunnerService } from '../../core/services/ScriptRunnerService';
import { ScriptRunner } from '../../core/entities/ScriptRunner';

export class ScriptRunnerController {
    public scriptRunnerService: ScriptRunnerService;

    constructor() {
        const scriptRunner = new ScriptRunner('tt.txt', '26.191.119.49', '0303708000', 26565);
        this.scriptRunnerService = new ScriptRunnerService(scriptRunner);
    }

    generateNames(): void {
        this.scriptRunnerService.generateNamesAndAppendToFile();
    }

    runScripts(): void {
        const names = this.scriptRunnerService.getNamesFromFile(); // Используйте метод
        this.scriptRunnerService.createScripts(names); // Используйте метод
        this.scriptRunnerService.runScripts();
    }
}
