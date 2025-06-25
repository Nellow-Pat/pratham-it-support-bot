import { CommandContext, Filter, CallbackQueryContext } from 'grammy';
import { BotContext } from '../models/context.model';

export const ICommand = 'ICommand';
export interface ICommand {
  readonly command: string;
  handle(ctx: CommandContext<BotContext>): Promise<void>;
}

export const ICallbackQueryHandler = 'ICallbackQueryHandler';
export interface ICallbackQueryHandler {
  readonly trigger: string | RegExp;
  handle(ctx: CallbackQueryContext<BotContext>): Promise<void>;
}

export const IMessageHandler = 'IMessageHandler';
export interface IMessageHandler {
  canHandle(ctx: Filter<BotContext, 'message:text'>): boolean;
  handle(ctx: Filter<BotContext, 'message:text'>): Promise<void>;
}