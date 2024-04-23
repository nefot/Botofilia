import {spawn, ChildProcess} from 'child_process';
import {readFileSync} from 'fs';

import * as fs from "fs";


namespace Setting {
    export const filename: string = 'tt.txt';
    export const names: string[] = readNamesFromFile(filename);
    export let scripts: string[] = [];
    export let host: string = "77.235.121.114"
    export let password: string = '0303708000'
    export let port: number = 0
}


function readNamesFromFile(filename: string): string[] {
    try {
        const data: string = readFileSync(filename, 'utf8');
        return data.trim().split('\n');
            
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
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
    let delay: number = 0;
    scriptList.forEach((script: string) => {
        setTimeout(() => {
            const childProcess: ChildProcess = spawn(script, {shell: true, stdio: 'inherit'});

            childProcess.on('close', (code: number | null) => {
                console.log(`Скрипт завершил выполнение с кодом ${code}: ${script}`);
            });

            childProcess.on('error', (err: Error) => {
                console.error(`Произошла ошибка при запуске скрипта: ${err}`);
            });

            // Закрываем скрипт через 2 секунды

        }, delay);
        delay += 5000; // Увеличиваем задержку на 5 секунд перед следующим запуском
    });
}


function generateNamesAndAppendToFile(): void {
    let names: string = '';

    for (let i: number = 1; i <= 1000; i++) {
        names += `nefoter${i}\n`;
    }

    try {
        fs.appendFileSync(Setting.filename, names);
        console.log('Имена успешно добавлены в файл names.txt');
    } catch (err) {
        console.error('Ошибка добавления имен в файл:', err);
    }
}

generateNamesAndAppendToFile();


console.log(Setting.names, Setting.names.length);
createScripts();
runScripts(Setting.scripts);
