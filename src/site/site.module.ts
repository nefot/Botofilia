// site.module.ts
import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { BotModule } from '../bot/bot.module';
import { CommandsModule } from '../commands/commands.module';

@Module({
  imports: [BotModule, CommandsModule],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
