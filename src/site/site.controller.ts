import { Body, Controller, Get, Post } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('api')
export class SiteController {
  constructor(private readonly siteService: SiteService) {
  }

  @Post('register')
  async registerBot(@Body() dto: { username: string; password: string; host: string; port: number }) {
    return this.siteService.registerBot(dto);
  }

  @Get('bots')
  async getAllBots() {
    return this.siteService.getAllBots(); // ✅ имя метода из SiteService
  }
}

