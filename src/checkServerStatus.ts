import * as fs from 'fs';
import * as path from 'path';
import * as mc from 'minecraft-protocol';

interface ExtendedPingOptions {
  host: string;
  port: number;
  timeout?: number;  // ← теперь timeout разрешён
}
function safePing(options: { host: string; port: number; timeout: number }) {
  return new Promise<any>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Ping timeout'));
    }, options.timeout);

    // Импортируем ping динамически
    let resolved = false;
    try {
      mc.ping(options, (err: Error | null, data: any) => {
        if (resolved) return;
        clearTimeout(timeoutId);
        resolved = true;
        if (err) {
          reject(err);
        } else if (!data || typeof data !== 'object') {
          reject(new Error('Empty or invalid response from server'));
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      if (!resolved) {
        clearTimeout(timeoutId);
        reject(err);
      }
    }
  });
}
async function checkServerStatus(host: string, port: number = 25565) {
  console.log(`🔍 Пингуем: ${host}:${port}`);

  let response;
  try {
    response = await safePing({ host, port, timeout: 10000 });
    console.log("🟢 Ответ получен:", JSON.stringify(response, null, 2));
  } catch (error: any) {
    console.error(`🔴 Ошибка ping:`, error.message || error);
    return;
  }

  // Теперь response гарантированно не null
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const logDir = path.join(__dirname, 'logs', `${year}-${month}`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, `${day}.log`);
  const timestamp = now.toISOString();
  let logData = `[${timestamp}] Сервер: ${host}:${port}\n`;

  if ('players' in response && response.players) {
    const online = response.players.online ?? 'неизвестно';
    const max = response.players.max ?? 'неизвестно';
    logData += `Онлайн: ${online}/${max}\n`;

    if (Array.isArray(response.players.sample) && response.players.sample.length > 0) {
      logData += "Игроки онлайн:\n";
      response.players.sample.forEach((player: any) => {
        const name = typeof player.name === 'string' ? player.name : 'неизвестный';
        logData += `- ${name}\n`;
      });
    } else {
      logData += "Нет информации о игроках.\n";
    }
  } else {
    logData += "Не удалось получить данные о игроках.\n";
  }

  try {
    fs.appendFileSync(logFile, logData + "\n", 'utf8');
    console.log("✅ Данные сохранены в", logFile);
  } catch (error) {
    console.error("❌ Ошибка записи лога:", error);
  }
}

function addHourlySeparator() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const logDir = path.join(__dirname, 'logs', `${year}-${month}`);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `${day}.log`);
    const separator = `\n------------------------------------------------------------------------\n`;
    try {
        fs.appendFileSync(logFile, separator, 'utf8');
        console.log("Добавлен разделитель в", logFile);
    } catch (error) {
        console.error("Ошибка при записи разделителя:", error);
    }
}

// Запуск проверки каждые 10 секунд
setInterval(() => checkServerStatus('birchcraft.hopto.org', 25565), 10 * 1000);

// Разделитель каждый час
setInterval(addHourlySeparator, 60 * 60 * 1000);

// Первоначальный запуск
checkServerStatus('birchcraft.hopto.org', 25565);