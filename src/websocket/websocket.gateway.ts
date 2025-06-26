import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { CommandService } from '../commands/command.service';
import { ClientRegistryService } from './client.registry';
import { MultiBotService } from '../bot/multi-bot.service';

@WebSocketGateway()
export class CommandGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly commandService: CommandService,
    private readonly clientRegistry: ClientRegistryService,
    private readonly botService: MultiBotService,
  ) {}

  handleConnection(socket: WebSocket) {
    console.log('[WS] Новое соединение');
  }

  handleDisconnect(socket: WebSocket) {
    this.clientRegistry.remove(socket);
    console.log('[WS] Клиент отключен');
  }

  @SubscribeMessage('message')
  async onMessage(@ConnectedSocket() socket: WebSocket, @MessageBody() data: string) {
    const [botName, ...parts] = data.trim().split(' ');
    const command = parts.join(' ');



    const bot = this.botService.get(botName);
    if (!bot) {
      socket.send(`Бот ${botName} не найден`);
      return;
    }

    await this.commandService.execute(command, bot);
  }
}
