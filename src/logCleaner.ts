import * as fs from 'fs';
import * as readline from 'readline';

async function cleanLogFile(inputPath: string, outputPath: string) {
    const inputStream = fs.createReadStream(inputPath, 'utf-8');
    const outputStream = fs.createWriteStream(outputPath, 'utf-8');

    const rl = readline.createInterface({ input: inputStream, crlfDelay: Infinity });

    for await (const line of rl) {
        if (!line.includes('[событие]') && !line.includes('[ошибка]')) {
            outputStream.write(line + '\n');
        }
    }

    outputStream.end();
    console.log(`Лог-файл очищен. Новый файл сохранен как ${outputPath}`);
}

cleanLogFile('src/logs/archive.log', 'src/logs/archive_cleaned_log.txt');