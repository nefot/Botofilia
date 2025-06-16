import { spawn, ChildProcess } from 'child_process';
import { readFileSync } from 'fs';
import * as WebSocket from 'ws';

namespace Setting {
  export const filename = 'tt.txt';
  export const names = readNamesFromFile(filename);
  export let scripts: string[] = [];
  export let host = '77.235.121.114';
  export let password = '0303708000';
  export let port = 25565;
  export let wsPort = 8080;
}

const bots: Record<string, ChildProcess> = {};

function readNamesFromFile(filename: string): string[] {
  try {
    const data = readFileSync(filename, 'utf8');
    return data.trim().split('\n').filter(name => name.length > 0);
  } catch (err) {
    console.error(`Ошибка чтения файла ${filename}:`, err);
    return [];
  }
}

async function runScripts(): Promise<void> {
  for (const botName of Setting.names) {
    const script = `ts-node src/main.ts ${botName} ${Setting.password} ${Setting.host} ${Setting.port}`;

    if (bots[botName]) {
      console.log(`Бот ${botName} уже запущен!`);
      continue;
    }

    console.log(`Ожидание 5 секунд перед запуском бота ${botName}...`);
    await new Promise((resolve) => setTimeout(resolve, 7000));

    const childProcess = spawn(script, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
    bots[botName] = childProcess;

    console.log(`Запущен бот: ${botName}`);

    childProcess.stdout.on('data', (data) => console.log(`[${botName}]: ${data.toString().trim()}`));
    childProcess.stderr.on('data', (data) => console.error(`[Ошибка ${botName}]: ${data.toString().trim()}`));

    childProcess.on('close', (code) => {
      console.log(`Бот ${botName} отключился с кодом ${code}`);
      delete bots[botName];
    });
  }
}

runScripts();
