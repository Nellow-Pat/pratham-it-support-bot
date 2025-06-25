import { Context, SessionFlavor } from 'grammy';
import { SessionData } from './session.model';

export type BotContext = Context & SessionFlavor<SessionData>;