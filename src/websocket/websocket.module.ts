import { Module } from '@nestjs/common';
import { CommandGateway } from './websocket.gateway';
import { ClientRegistryService } from './client.registry';
import { BotModule } from '../bot/bot.module';
import { CommandsModule } from '../commands/commands.module';

@Module({
  imports: [BotModule, CommandsModule],
  providers: [CommandGateway, ClientRegistryService],
})
export class WebSocketModule {}
