import { Bot } from 'grammy';
import { injectable, inject, singleton } from 'tsyringe';
import { BotFactory } from '../factories/BotFactory';
import { IBotService } from '../interfaces/IBotService';
import { LoggerService } from '@/utils/logger';
import { BotContext } from '@/bot/models/context.model';

@singleton()
@injectable()
export class BotService implements IBotService {
  private readonly bot: Bot<BotContext>;

  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(BotFactory) private readonly botFactory: BotFactory,
  ) {
    this.logger.info('Initializing Bot Service...');
    this.bot = this.botFactory.createBot();
    this.setupErrorHandling();
    this.setupGracefulShutdown();
  }

  public getBotInstance(): Bot<BotContext> {
    return this.bot;
  }

  public async start(): Promise<void> {
    this.logger.info('Starting Telegram bot connection...');
    await this.bot.start({
      onStart: (botInfo) => {
        this.logger.info(`Bot @${botInfo.username} started successfully.`);
      },
    });
  }

  private setupErrorHandling(): void {
    this.bot.catch((err) => {
      const ctx = err.ctx;
      const errorObj = err.error instanceof Error
        ? err.error
        : typeof err.error === 'object' && err.error !== null
          ? err.error
          : { message: String(err.error) };
      this.logger.error(
        `Error while handling update ${ctx.update.update_id}:`,
        errorObj,
      );
    });
  }

  private setupGracefulShutdown(): void {
    const stopBot = async () => {
      this.logger.warn(
        'SIGINT/SIGTERM received. Shutting down bot gracefully...',
      );
      if (this.bot.isInited()) {
        await this.bot.stop();
      }
      this.logger.info('Bot has been stopped.');
      process.exit(0);
    };

    process.once('SIGINT', stopBot);
    process.once('SIGTERM', stopBot);
  }
}