import { Injectable } from '@nestjs/common';
import { MultiBotService } from '../bot/multi-bot.service';

@Injectable()
export class SiteService {
  constructor(private readonly botManager: MultiBotService) {
  }


  registerBot(dto: { username: string; password: string; host: string; port: number }) {
    return this.botManager.create(dto.username, dto.password, dto.host, dto.port);
  }

  getAllBots() {
    return this.botManager.getAll(); // возвращает список имён ботов
  }
}
