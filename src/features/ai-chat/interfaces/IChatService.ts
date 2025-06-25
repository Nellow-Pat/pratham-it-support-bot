import { BotContext } from '@/core/models/context.model';
import { CallbackQueryContext, CommandContext, Filter } from 'grammy';

export const IChatService = Symbol('IChatService');

export interface IChatService {
  initiateChat(ctx: CallbackQueryContext<BotContext>): Promise<void>;
  handleConversation(ctx: Filter<BotContext, 'message:text'>): Promise<void>;
  endChat(ctx: CommandContext<BotContext>): Promise<void>;
}