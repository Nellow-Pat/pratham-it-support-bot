import { injectable, inject } from 'tsyringe';
import { BotContext } from '@/core/models/context.model';
import { NavigationalViewFactory } from '../factories/NavigationalViewFactory';
import { IMenuViewService } from '../interfaces/IMenuViewService';
import { IDynamicViewService } from '@/shared/dynamic-views/interfaces/IDynamicViewService';

@injectable()
export class MenuViewService implements IMenuViewService {
  constructor(
    @inject(NavigationalViewFactory) private readonly viewFactory: NavigationalViewFactory,
    @inject(IDynamicViewService) private readonly dynamicViewService: IDynamicViewService,
  ) {}

  public async sendView(ctx: BotContext, viewName: string): Promise<void> {
    const viewData = await this.viewFactory.loadView(viewName);

    await this.dynamicViewService.sendView(ctx, viewData);
  }
}