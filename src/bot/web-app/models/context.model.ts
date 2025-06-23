import { Filter } from 'grammy';
import { BotContext } from '@/bot/models/context.model';

export type WebAppDataContext = Filter<BotContext, 'message:web_app_data'>;