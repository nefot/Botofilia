import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class ClientRegistryService {
  private readonly clients = new Map<string, WebSocket>();

  register(name: string, socket: WebSocket) {
    this.clients.set(name, socket);
    console.log(`[WS] Бот ${name} зарегистрирован`);
  }

  get(name: string): WebSocket | undefined {
    return this.clients.get(name);
  }

  remove(socket: WebSocket) {
    for (const [name, ws] of this.clients.entries()) {
      if (ws === socket) {
        this.clients.delete(name);
        console.log(`[WS] Бот ${name} отключён`);
      }
    }
  }

  list(): string[] {
    return Array.from(this.clients.keys());
  }
}
