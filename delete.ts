import * as fs from 'fs';
import * as path from 'path';

const structure = [
  'src/app.module.ts',
  'src/main.ts',
  'src/bot/bot.module.ts',
  'src/bot/bot.service.ts',
  'src/bot/bot.factory.ts',
  'src/commands/commands.module.ts',
  'src/commands/command.service.ts',
  'src/commands/handlers/say.handler.ts',
  'src/commands/handlers/move.handler.ts',
  'src/logger/logger.module.ts',
  'src/logger/logger.service.ts',
  'src/logger/utils/index.ts',
  'src/websocket/websocket.module.ts',
  'src/websocket/websocket.gateway.ts',
  'src/websocket/client.registry.ts',
  'src/status-checker/status-checker.module.ts',
  'src/status-checker/status-checker.service.ts',
  'src/status-checker/log-writer.ts',
  'src/status-checker/time-utils.ts',
  'src/site/site.module.ts',
  'src/site/site.controller.ts',
  'src/site/site.service.ts',
  'src/shared/utils.ts',
];

structure.forEach(file =>
{
  const fullPath = path.resolve(file);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, '');
});

console.log('✅ Структура создана');
