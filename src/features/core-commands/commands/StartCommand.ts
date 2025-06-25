import { injectable, inject } from 'tsyringe';
import { CommandContext } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { ICommand } from '@/core/interfaces/IHandler';
import { IMenuViewService } from '../interfaces/IMenuViewService';

@injectable()
export class StartCommand implements ICommand {
  public readonly command = 'start';

  constructor(@inject(IMenuViewService) private readonly menuService: IMenuViewService) {}

  public async handle(ctx: CommandContext<BotContext>): Promise<void> {
    await this.menuService.sendView(ctx, 'main_menu');
  }
}