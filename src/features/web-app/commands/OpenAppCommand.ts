import { injectable, inject } from 'tsyringe';
import { CommandContext } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { ICommand } from '@/core/interfaces/IHandler';
import { WebAppButtonView } from '../views/WebAppButtonView';
import { Config } from '@/config';

@injectable()
export class OpenAppCommand implements ICommand {
  public readonly command = 'open_app';

  constructor(
    @inject(WebAppButtonView) private readonly view: WebAppButtonView,
    @inject(Config) private readonly config: Config,
  ) {}

  public async handle(ctx: CommandContext<BotContext>): Promise<void> {
    const keyboard = this.view.build({
      text: 'Open CRM',
      url: this.config.webAppUrl,
    });

    await ctx.reply('Click the button below to open our custom interface!', {
      reply_markup: keyboard,
    });
  }
}