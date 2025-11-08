// script.ts
import { spawn, ChildProcess } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

namespace Setting {
    export const namesFile = path.resolve(__dirname, 'tt.txt'); // слова для генерации имён (по одной на строку)
    // Встроенный список прокси (взято из вашего сообщения)
    export const PROXIES_RAW = [
        "194.67.217.214:9463:794G8A:3f0pKx",
        "194.67.216.56:9075:794G8A:3f0pKx",
        "194.67.213.2:9198:794G8A:3f0pKx",
        "194.67.215.93:9044:794G8A:3f0pKx",
        "194.67.213.143:9532:794G8A:3f0pKx",
        "194.67.213.194:9757:794G8A:3f0pKx",
        "194.67.214.136:9942:794G8A:3f0pKx",
        "194.67.215.182:9512:794G8A:3f0pKx",
        "194.67.218.58:9232:794G8A:3f0pKx",
        "194.67.214.185:9655:794G8A:3f0pKx"
    ];

    export const password = '_6fuvtrf7jutig8k_';
    export const host = 'birchcraft.hopto.org';
    export const port = 25565;
    export const perProxyMin = 10; // минимум экземпляров на прокси
    export const perProxyMax = 20; // максимум экземпляров на прокси
    export const delayMs = 7000; // задержка между запусками на одном прокси (мс)
    export const nodeCmd = 'ts-node'; // команда запуска (ts-node / node)
    export const scriptPath = 'src/main.ts'; // путь к main.ts
}

function readLines(fn: string): string[] {
    try {
        if (!existsSync(fn)) return [];
        const data = readFileSync(fn, 'utf8');
        return data.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    } catch (err) {
        console.error(`Ошибка чтения ${fn}:`, err);
        return [];
    }
}

const namesPool = readLines(Setting.namesFile);

const proxies = Setting.PROXIES_RAW.slice(); // копия

const bots: Record<string, ChildProcess> = {};
const usedNames = new Set<string>();

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function sanitizePart(s: string) {
    return s.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
}

function makeRandomName(): string {
    // Пытаемся собрать имя из двух слов из tt.txt
    let a = pickRandom(namesPool) || '';
    let b = pickRandom(namesPool) || '';

    // Фоллбек-списки, если tt.txt пустой или короткий
    const male = ['andrey','ivan','sergey','oleg','dmitry','alex','pavel','egor','nikita','maxim'];
    const last = ['ivanov','petrov','sidorov','smirnov','kuznetsov','volkov','morozov','popov','lebedev'];

    if (!a) a = pickRandom(male)!;
    if (!b) b = pickRandom(last)!;

    a = sanitizePart(a);
    b = sanitizePart(b);

    // пробуем несколько раз получить уникальное имя
    for (let attempt = 0; attempt < 20; attempt++) {
        const suffix = randInt(1, 999);
        const name = `${a}_${b}${suffix}`;
        if (!usedNames.has(name)) {
            usedNames.add(name);
            return name;
        }
    }

    // если всё-таки коллизии — добавим большой рандомный суффикс
    const finalName = `${a}_${b}${Date.now() % 100000}`;
    usedNames.add(finalName);
    return finalName;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function launchForProxy(proxyLine: string) {
    const proxy = proxyLine.trim();
    if (!proxy) return;

    const count = randInt(Setting.perProxyMin, Setting.perProxyMax);
    console.log(`Proxy ${proxy} → запустим ${count} ботов (задержка ${Setting.delayMs}ms).`);

    for (let i = 0; i < count; i++) {
        let botName = makeRandomName();

        // безопасность: если имя вдруг занято — генерируем ещё раз
        while (bots[botName]) {
            botName = makeRandomName();
        }

        // формируем команду: ts-node src/main.ts <ник> <пароль> <host> <port> "<proxy>"
        const cmd = `${Setting.nodeCmd} ${Setting.scriptPath} ${botName} ${Setting.password} ${Setting.host} ${Setting.port} "${proxy}"`;
        console.log(`Запуск [${botName}] на прокси ${proxy}`);

        const cp = spawn(cmd, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });

        bots[botName] = cp;

        cp.stdout.on('data', (d) => {
            process.stdout.write(`[${botName}] ${d.toString()}`);
        });
        cp.stderr.on('data', (d) => {
            process.stderr.write(`[${botName} ERR] ${d.toString()}`);
        });
        cp.on('close', (code) => {
            console.log(`Процесс ${botName} завершился с кодом ${code}`);
            delete bots[botName];
            // не удаляем usedNames — чтобы не пересоздать такое же имя в будущем
        });

        // задержка перед следующим экземпляром на том же прокси
        if (i < count - 1) await sleep(Setting.delayMs);
    }

    console.log(`Все ${count} ботов для прокси ${proxy} запущены (или попытки запущены).`);
}

async function runAll() {
    if (!proxies.length) {
        console.error('Список прокси пуст. Проверьте PROXIES_RAW.');
        return;
    }
    const tasks = proxies.map(p => launchForProxy(p));
    await Promise.all(tasks);
    console.log('Запуски по всем прокси завершены.');
}

// старт
runAll().catch(err => {
    console.error('Ошибка в runAll:', err);
});
