import { injectable, inject } from 'tsyringe';
import { CommandContext } from 'grammy';
import { BotContext } from '@/bot/models/context.model';
import { IChatSessionService } from '../interfaces/IChatSessionService';
import { LoggerService } from '@/utils/logger';
import { ICommand } from '@/bot/base/interfaces/IHandler';

@injectable()
export class EndCommand implements ICommand {
  public readonly command = 'end';

  constructor(
    @inject(IChatSessionService)
    private readonly sessionService: IChatSessionService,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  public async handle(ctx: CommandContext<BotContext>): Promise<void> {
    if (!ctx.from) return;

    const sessionEnded = this.sessionService.endSession(ctx.from.id);

    if (sessionEnded) {
      this.logger.info(`Ended session for user ${ctx.from.id}`);
      await ctx.reply('Chat session ended. Use /start to see the menu again.');
    } else {
      await ctx.reply('No active chat session to end.');
    }
  }
}