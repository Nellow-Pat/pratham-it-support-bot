import { injectable, inject } from 'tsyringe';
import { Filter } from 'grammy';
import { BotContext } from '@/bot/models/context.model';
import { IMessageHandler } from '@/bot/base/interfaces/IHandler';
import { IChatService } from '../interfaces/IChatService';
import { IChatSessionService } from '../interfaces/IChatSessionService';

@injectable()
export class ConversationMessageHandler implements IMessageHandler {
  constructor(
    @inject(IChatService) private readonly chatService: IChatService,
    @inject(IChatSessionService)
    private readonly sessionService: IChatSessionService,
  ) {}

  public canHandle(ctx: Filter<BotContext, 'message:text'>): boolean {
    return !!(ctx.from && this.sessionService.getSessionId(ctx.from.id));
  }

  public async handle(ctx: Filter<BotContext, 'message:text'>): Promise<void> {
    await this.chatService.handleConversation(ctx);
  }
}