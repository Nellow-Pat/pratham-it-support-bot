import { BotContext } from '@/core/models/context.model';
import { DynamicViewData } from '../models/dynamic-view.dto';

export const IDynamicViewService = Symbol('IDynamicViewService');

export interface IDynamicViewService {
  sendView(ctx: BotContext, viewData: DynamicViewData): Promise<void>;
  sendViewToChat(chatId: string | number, viewData: DynamicViewData): Promise<void>;
}