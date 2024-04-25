import { spawn, ChildProcess } from 'child_process';
import { readFileSync, appendFileSync } from 'fs';

namespace Setting {
    export const filename = 'tt.txt';
    export const names = readNamesFromFile(filename);
    export let scripts: string[] = [];
    export let host = '77.235.121.114';
    export let password = '0303708000';
    export let port = 0;
}

function readNamesFromFile(filename: string): string[] {
    try {
        const data = readFileSync(filename, 'utf8');
        return data.trim().split('\n');
    } catch (err) {
        console.error(`Error reading file ${filename}:`, err);
        return [];
    }
}

function createScripts(): void {
    for (const name of Setting.names) {
        Setting.scripts.push(`node dist/main.js ${name.replace(/\r/g, '')} ${Setting.password} ${Setting.host}`);
    }
    console.log(Setting.scripts);
}

function runScripts(scriptList: string[]): void {
    let delay = 0;
    scriptList.forEach((script: string) => {
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

function generateNamesAndAppendToFile(): void {
    let names = '';

    for (let i = 1; i <= 1000; i++) {
        names += `nefoter${i}\n`;
    }

    try {
        appendFileSync(Setting.filename, names);
        console.log('Names successfully added to the file', Setting.filename);
    } catch (err) {
        console.error('Error adding names to file:', err);
    }
}

generateNamesAndAppendToFile();

console.log(Setting.names, Setting.names.length);
createScripts();
runScripts(Setting.scripts);
