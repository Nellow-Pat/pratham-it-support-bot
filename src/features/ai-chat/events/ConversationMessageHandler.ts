import { injectable, inject } from 'tsyringe';
import { Filter } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { IMessageHandler } from '@/core/interfaces/IHandler';
import { IChatService } from '../interfaces/IChatService';

@injectable()
export class ConversationMessageHandler implements IMessageHandler {
  constructor(
    @inject(IChatService) private readonly chatService: IChatService,
  ) {}

  public canHandle(ctx: Filter<BotContext, 'message:text'>): boolean {
    return !!ctx.session.activeChatId;
  }

  public async handle(ctx: Filter<BotContext, 'message:text'>): Promise<void> {
    await this.chatService.handleConversation(ctx);
  }
}