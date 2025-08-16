// src/checkServerStatus.ts
import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';
import axios from 'axios';

const HOST = '77.235.121.114';
const PORT = 25565;
const LOGS_BASE = path.join(__dirname, 'logs');

async function sendToBot(data: { online: number; max: number; players: string[] }) {
  try {
    await axios.post('http://localhost:8000/update_status', data);
    console.log('Данные отправлены боту');
  } catch (error) {
    console.error('Ошибка при отправке данных в бота:', error);
  }
}

function getLogPaths() {
  const now = new Date();
  const moscowOffset = 3 * 60 * 60 * 1000;
  const moscowTime = new Date(now.getTime() + moscowOffset);

  const day = String(moscowTime.getUTCDate()).padStart(2, '0');
  const month = String(moscowTime.getUTCMonth() + 1).padStart(2, '0');
  const year = moscowTime.getUTCFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const hours = String(moscowTime.getUTCHours()).padStart(2, '0');
  const minutes = String(moscowTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(moscowTime.getUTCSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const yearMonth = `${year}-${month}`;
  const logDir = path.join(LOGS_BASE, yearMonth);
  const logFile = path.join(logDir, `${day}.log`);

  return {
    logDir,
    logFile,
    date: formattedDate,
    time: formattedTime,
    timestamp: `${formattedDate} ${formattedTime}`
  };
}

function writeLog(filePath: string, content: string) {
  fs.appendFileSync(filePath, content + '\n', 'utf8');
}

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function handleServerResponse(host: string, port: number, response: any) {
  if (!response) {
    console.error('Пустой ответ от сервера');
    return;
  }

  const { logDir, logFile, timestamp } = getLogPaths();
  ensureDirExists(logDir);

  let logData = `[${timestamp}] Сервер: ${host}:${port}\n`;

  if (response.players) {
    const players = response.players.sample?.map((p: { name: string }) => p.name) || [];
    await sendToBot({ online: response.players.online, max: response.players.max, players });
    logData += `Онлайн: ${response.players.online}/${response.players.max}\n`;

    if (players.length > 0) {
      logData += 'Игроки онлайн:\n' + players.map((name: string) => `- ${name}`).join('\n') + '\n';
    } else {
      logData += 'Нет информации о игроках.\n';
    }
  } else {
    logData += 'Не удалось получить данные о игроках.\n';
  }

  writeLog(logFile, logData);
  console.log('Данные о сервере сохранены в', logFile);
}

/**
 * Promise-обёртка для mc.ping (callback API)
 * Убираем передачу `version` чтобы избежать поиска protocol => null
 */
function pingAsync(opts: { host: string; port: number; timeout?: number }): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // mc.ping имеет сигнатуру (opts, cb)
      mc.ping({ host: opts.host, port: opts.port, timeout: opts.timeout ?? 5000 }, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function checkServerStatus(host: string, port: number) {
  try {
    // лог опций для диагностики
    // console.log('ping options:', { host, port });

    const response = await pingAsync({ host, port, timeout: 5000 });
    if (!response) {
      console.error('Пустой ответ от mc.ping');
      return;
    }
    await handleServerResponse(host, port, response);
  } catch (error) {
    console.error('Ошибка при проверке сервера:', error);
  }
}

function addHourlySeparator() {
  const { logDir, logFile } = getLogPaths();
  ensureDirExists(logDir);
  const separator = '\n------------------------------------------------------------------------\n';
  writeLog(logFile, separator);
  console.log('Добавлен разделитель в', logFile);
}

// Интервалы
setInterval(() => checkServerStatus(HOST, PORT), 10 * 1000);
setInterval(addHourlySeparator, 60 * 60 * 1000);
checkServerStatus(HOST, PORT);
