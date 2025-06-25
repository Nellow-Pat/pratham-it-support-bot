import { injectable, inject } from 'tsyringe';
import { CallbackQueryContext } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { ICallbackQueryHandler } from '@/core/interfaces/IHandler';
import { IChatService } from '../interfaces/IChatService';

@injectable()
export class StartAiChatCallbackHandler implements ICallbackQueryHandler {
  public readonly trigger = 'start_ai_chat';

  constructor(
    @inject(IChatService) private readonly chatService: IChatService,
  ) {}

  public async handle(ctx: CallbackQueryContext<BotContext>): Promise<void> {
    await this.chatService.initiateChat(ctx);
  }
}