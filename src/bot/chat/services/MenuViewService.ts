import { injectable, inject, singleton } from 'tsyringe';
import { BotContext } from '@/bot/models/context.model';
import { LoggerService } from '@/utils/logger';
import { NavigationalViewFactory } from '../factories/NavigationalViewFactory';
import { MenuView } from '../views/MenuView';
import { IMenuViewService } from '../interfaces/IMenuViewService';

@singleton()
@injectable()
export class MenuViewService implements IMenuViewService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(NavigationalViewFactory) private readonly viewFactory: NavigationalViewFactory,
    @inject(MenuView) private readonly menuView: MenuView,
  ) {}

  public async sendView(ctx: BotContext, viewName: string): Promise<void> {
    try {
      const viewData = await this.viewFactory.loadView(viewName);
      const keyboard = this.menuView.build({ buttons: viewData.buttons });
      const text = [`*${viewData.title}*`, '', ...viewData.body].join('\n');

      const isCallback = !!ctx.callbackQuery;
      const hasOriginalPhoto = !!ctx.callbackQuery?.message?.photo;

      if (isCallback) {
        await ctx.answerCallbackQuery();

        if (hasOriginalPhoto && !viewData.image_url) {
          await ctx.deleteMessage();
          await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
        } else if (hasOriginalPhoto && viewData.image_url) {
          await ctx.editMessageCaption({ caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
        } else if (!hasOriginalPhoto && viewData.image_url) {
          await ctx.deleteMessage();
          await ctx.replyWithPhoto(viewData.image_url, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
        } else {
          await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
        }
      } else {
        if (viewData.image_url) {
          await ctx.replyWithPhoto(viewData.image_url, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
        } else {
          await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
        }
      }
    } catch (error) {
      const errorObj = error instanceof Error
        ? error
        : typeof error === 'object' && error !== null
          ? error
          : { message: String(error) };
      this.logger.error(`Failed to send view: ${viewName}`, errorObj);
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: 'An error occurred!', show_alert: true });
      } else {
        await ctx.reply('Sorry, there was an error displaying that content.');
      }
    }
  }
}