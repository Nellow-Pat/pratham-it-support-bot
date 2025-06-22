import { BotContext } from '@/bot/models/context.model';
import { CommandContext } from 'grammy';

export const ICommand = 'ICommand';

export interface ICommand {
  readonly command: string;
  handle(ctx: CommandContext<BotContext>): Promise<void>;
}