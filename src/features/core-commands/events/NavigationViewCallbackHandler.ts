import { injectable, inject } from 'tsyringe';
import { CallbackQueryContext } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { ICallbackQueryHandler } from '@/core/interfaces/IHandler';
import { IMenuViewService } from '../interfaces/IMenuViewService';

@injectable()
export class NavigationViewCallbackHandler implements ICallbackQueryHandler {
  public readonly trigger = /^view:/;

  constructor(
    @inject(IMenuViewService) private readonly menuService: IMenuViewService,
  ) {}

  public async handle(ctx: CallbackQueryContext<BotContext>): Promise<void> {
    const viewName = ctx.callbackQuery.data.split(':')[1];
    if (viewName) {
      await this.menuService.sendView(ctx, viewName);
    }
  }
}