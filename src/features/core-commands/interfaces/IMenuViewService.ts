import { BotContext } from '@/core/models/context.model';

export const IMenuViewService = Symbol('IMenuViewService');

export interface IMenuViewService {
  sendView(ctx: BotContext, viewName: string): Promise<void>;
}