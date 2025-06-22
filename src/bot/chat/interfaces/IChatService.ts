import { BotContext } from '@/bot/models/context.model';

export const IChatService = Symbol('IChatService');

export interface IChatService {
  sendWelcomeMessage(ctx: BotContext): Promise<void>;
  // handleUserQuery(ctx)
}