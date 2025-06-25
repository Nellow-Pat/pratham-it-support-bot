import { User } from 'grammy/types';

export interface ParserContext {
  from?: User;
  reply(text: string, options?: any): Promise<unknown>;
}