import { injectable, inject } from 'tsyringe';
import { BotContext } from '@/core/models/context.model';
import { LoggerService } from '@/utils/logger';
import { NavigationalViewFactory } from '../factories/NavigationalViewFactory';
import { MenuView } from '../views/MenuView';
import { IMenuViewService } from '../interfaces/IMenuViewService';
import { toError } from '@/utils/ErrorUtils';

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

        const commonOptions = { parse_mode: 'Markdown' as const, reply_markup: keyboard };

        if (hasOriginalPhoto && !viewData.image_url) {
          await ctx.deleteMessage();
          await ctx.reply(text, commonOptions);
        } else if (hasOriginalPhoto && viewData.image_url) {
          await ctx.editMessageMedia({ type: 'photo', media: viewData.image_url, caption: text, ...commonOptions });
        } else if (!hasOriginalPhoto && viewData.image_url) {
          await ctx.deleteMessage();
          await ctx.replyWithPhoto(viewData.image_url, { caption: text, ...commonOptions });
        } else {
          await ctx.editMessageText(text, commonOptions);
        }
      } else {
        if (viewData.image_url) {
          await ctx.replyWithPhoto(viewData.image_url, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
        } else {
          await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
        }
      }
    } catch (e) {
      const error = toError(e);
      this.logger.error(`Failed to send view: ${viewName}`, error);
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: 'An error occurred displaying the menu!', show_alert: true });
      } else {
        await ctx.reply('Sorry, there was an error displaying that content.');
      }
    }
  }
}