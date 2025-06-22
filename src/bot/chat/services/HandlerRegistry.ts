import { injectable, inject, injectAll } from 'tsyringe';
import { ICommand } from '@/bot/chat/interfaces/ICommand';
import { LoggerService } from '@/utils/logger';
import { IBotService } from '@/bot/base/interfaces/IBotService';

@injectable()
export class HandlerRegistry {
  constructor(
    @inject(IBotService) private readonly botService: IBotService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @injectAll(ICommand) private readonly commands: ICommand[],
  ) {}

  public initializeHandlers(): void {
    this.logger.info(
      `Initializing handlers. Found ${this.commands.length} commands.`,
    );
    const bot = this.botService.getBotInstance();

    for (const command of this.commands) {
      this.logger.info(`Registering command: /${command.command}`);
      bot.command(command.command, (ctx) => command.handle(ctx));
    }

    // callback queries, message listeners should be registered here.
  }
}