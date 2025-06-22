import { Bot } from 'grammy';
import { injectable, inject } from 'tsyringe';
import { Config } from '@/models/config.model';
import { BotContext } from '@/bot/models/context.model';

@injectable()
export class BotFactory {
  constructor(@inject(Config) private readonly config: Config) {}

  public createBot(): Bot<BotContext> {
    const bot = new Bot<BotContext>(this.config.telegramBotToken);
    return bot;
  }
}