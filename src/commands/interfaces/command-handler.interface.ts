import { Bot } from 'mineflayer';

export interface ICommandHandler {
  execute(args: string[], bot: Bot): Promise<void>;
}
