import { injectable, inject, injectAll } from 'tsyringe';
import { IBotService } from '../interfaces/IBotService';
import {
  ICommand,
  ICallbackQueryHandler,
  IMessageHandler,
} from '../interfaces/IHandler';
import { LoggerService } from '@/utils/logger';

@injectable()
export class HandlerRegistry {
  constructor(
    @inject(IBotService) private readonly botService: IBotService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @injectAll(ICommand) private readonly commands: ICommand[],
    @injectAll(ICallbackQueryHandler)
    private readonly callbackHandlers: ICallbackQueryHandler[],
    @injectAll(IMessageHandler)
    private readonly messageHandlers: IMessageHandler[],
  ) {}

  public initializeHandlers(): void {
    this.logger.info('Initializing all event handlers...');
    const bot = this.botService.getBotInstance();

    this.logger.info(`Registering ${this.commands.length} command handlers.`);
    for (const handler of this.commands) {
      bot.command(handler.command, (ctx) => handler.handle(ctx));
    }

    this.logger.info(
      `Registering ${this.callbackHandlers.length} callback query handlers.`,
    );
    for (const handler of this.callbackHandlers) {
      bot.callbackQuery(handler.trigger, (ctx) => handler.handle(ctx));
    }

    this.logger.info(
      `Registering ${this.messageHandlers.length} message handlers.`,
    );
    bot.on('message:text', async (ctx) => {
      if (ctx.message.text.startsWith('/')) return;

      for (const handler of this.messageHandlers) {
        if (handler.canHandle(ctx)) {
          await handler.handle(ctx);
          return;
        }
      }
    });
  }
}