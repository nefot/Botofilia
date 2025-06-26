import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { CommandsModule } from './commands/commands.module';
import { WebSocketModule } from './websocket/websocket.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    BotModule,
    CommandsModule,
    WebSocketModule,SiteModule, // или REST API
  ],
})
export class AppModule {}


