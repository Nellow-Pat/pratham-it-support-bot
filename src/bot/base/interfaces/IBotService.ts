import { Bot } from 'grammy';
import { BotContext } from '@/bot/models/context.model';

export const IBotService = Symbol('IBotService');

export interface IBotService {
  getBotInstance(): Bot<BotContext>;
  start(): Promise<void>;
}