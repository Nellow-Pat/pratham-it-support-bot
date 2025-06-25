import { Bot } from 'grammy';
import { DependencyContainer } from 'tsyringe';
import { BotContext } from '@/core/models/context.model';
import { IFeatureModule } from '@/core/interfaces/IFeatureModule';
import { ICommand } from '@/core/interfaces/IHandler';
import { OpenAppCommand } from './commands/OpenAppCommand';
import { WebAppButtonView } from './views/WebAppButtonView';
import { WebAppParserRegistry } from './implementations/WebAppParserRegistry';
import { IWebAppParser } from './interfaces/IWebAppParser';
import { IssueReportParser } from './implementations/IssueReportParser';

export default class WebAppFeature implements IFeatureModule {
  public readonly name = 'web-app';

  public register(container: DependencyContainer): void {
    container.register(ICommand, { useClass: OpenAppCommand });
    container.register(IWebAppParser, { useClass: IssueReportParser });

    container.registerSingleton(WebAppParserRegistry);
    container.register(WebAppButtonView, { useClass: WebAppButtonView });
  }

  public initialize(bot: Bot<BotContext>, container: DependencyContainer): void {
    const commands = container.resolveAll<ICommand>(ICommand);
    commands.forEach(handler => bot.command(handler.command, (ctx) => handler.handle(ctx)));
  }
}