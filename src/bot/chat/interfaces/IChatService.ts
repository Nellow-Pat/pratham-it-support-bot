import { BotContext } from '@/bot/models/context.model';
import { CallbackQueryContext, Filter } from 'grammy';

export const IChatService = Symbol('IChatService');

export interface IChatService {
  initiateChat(ctx: CallbackQueryContext<BotContext>): Promise<void>;
  handleConversation(ctx: Filter<BotContext, 'message:text'>): Promise<void>;
}