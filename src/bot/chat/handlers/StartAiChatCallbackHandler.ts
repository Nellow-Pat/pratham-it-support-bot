import { injectable, inject } from 'tsyringe';
import { CallbackQueryContext } from 'grammy';
import { BotContext } from '@/bot/models/context.model';
import { ICallbackQueryHandler } from '@/bot/base/interfaces/IHandler';
import { IChatService } from '../interfaces/IChatService';

@injectable()
export class StartAiChatCallbackHandler implements ICallbackQueryHandler {
  public readonly trigger = 'start_ai_chat';

  constructor(
    @inject(IChatService) private readonly chatService: IChatService,
  ) {}

  public async handle(ctx: CallbackQueryContext<BotContext>): Promise<void> {
    await ctx.answerCallbackQuery({ text: 'Starting a new chat session...' });
    await this.chatService.initiateChat(ctx);
  }
}