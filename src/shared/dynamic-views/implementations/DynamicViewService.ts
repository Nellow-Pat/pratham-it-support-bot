import { injectable, inject } from 'tsyringe';
import { BotContext } from '@/core/models/context.model';
import { LoggerService } from '@/utils/logger';
import { toError } from '@/utils/ErrorUtils';
import { MenuView } from '@/features/core-commands/views/MenuView';
import { Bot } from 'grammy';
import { IDynamicViewService } from '../interfaces/IDynamicViewService';
import { DynamicViewData } from '../models/dynamic-view.dto';

@injectable()
export class DynamicViewService implements IDynamicViewService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(MenuView) private readonly menuViewBuilder: MenuView,
    @inject(Bot) private readonly bot: Bot<BotContext>,
  ) {}

  private prepareView(viewData: DynamicViewData) {
    const keyboard = viewData.buttons && viewData.buttons.length > 0
      ? this.menuViewBuilder.build({ buttons: viewData.buttons })
      : undefined;

    const titleLine = viewData.title ? `*${viewData.title}*` : '';
    const text = [titleLine, '', ...viewData.body].join('\n');
    
    return { text, keyboard };
  }

  public async sendViewToChat(chatId: string | number, viewData: DynamicViewData): Promise<void> {
    const { text, keyboard } = this.prepareView(viewData);
    const options = { parse_mode: 'Markdown' as const, reply_markup: keyboard };

    if (viewData.image_url) {
      await this.bot.api.sendPhoto(chatId, viewData.image_url, { caption: text, ...options });
    } else {
      await this.bot.api.sendMessage(chatId, text, options);
    }
  }

  public async sendView(ctx: BotContext, viewData: DynamicViewData): Promise<void> {
    try {
      const { text, keyboard } = this.prepareView(viewData);
      const options = { parse_mode: 'Markdown' as const, reply_markup: keyboard };

      const isCallback = !!ctx.callbackQuery;
      
      if (isCallback) {
        await ctx.answerCallbackQuery();
        const hasOriginalPhoto = !!ctx.callbackQuery?.message?.photo;

        if (hasOriginalPhoto && !viewData.image_url) {
            await ctx.deleteMessage();
            await ctx.reply(text, options);
        } else if (hasOriginalPhoto && viewData.image_url) {
            await ctx.editMessageMedia({ type: 'photo', media: viewData.image_url, caption: text, ...options });
        } else if (!hasOriginalPhoto && viewData.image_url) {
            await ctx.deleteMessage();
            await ctx.replyWithPhoto(viewData.image_url, { caption: text, ...options });
        } else {
            await ctx.editMessageText(text, options);
        }
      } else {
        if (viewData.image_url) {
          await ctx.replyWithPhoto(viewData.image_url, { caption: text, ...options });
        } else {
          await ctx.reply(text, options);
        }
      }
    } catch (e) {
      const error = toError(e);
      this.logger.error(`Failed to send dynamic view`, error);
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: 'An error occurred.', show_alert: true });
      } else {
        await ctx.reply('Sorry, there was an error displaying that content.');
      }
    }
  }
}