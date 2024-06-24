import { spawn, ChildProcess } from 'child_process';
import { appendFileSync } from 'fs';
import { IScriptRunner } from '../interfaces/ScriptRunner';
import { ScriptRunner } from '../entities/ScriptRunner';

export class ScriptRunnerService {
    constructor(private scriptRunner: ScriptRunner) {}

    generateNamesAndAppendToFile(): void {
        let names = '';
        for (let i = 1; i <= 1000; i++) {
            names += `nefoter${i}\n`;
        }
        appendFileSync(this.scriptRunner.filename, names);
    }

    runScripts(): void {
        let delay = 0;
        this.scriptRunner.scripts.forEach((script: string) => {
            setTimeout(() => {
                const childProcess: ChildProcess = spawn(script, { shell: true, stdio: 'inherit' });
                childProcess.on('close', (code: number | null) => {
                    console.log(`Script finished with code ${code}: ${script}`);
                });
                childProcess.on('error', (err: Error) => {
                    console.error(`Error running script: ${err}`);
                });
            }, delay);
            delay += 5000;
        });
    }
}
