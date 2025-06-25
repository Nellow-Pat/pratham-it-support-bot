import { Bot } from 'grammy';
import { DependencyContainer } from 'tsyringe';
import { BotContext } from '@/core/models/context.model';
import { IFeatureModule } from '@/core/interfaces/IFeatureModule';
import { ICommand, ICallbackQueryHandler, IMessageHandler } from '@/core/interfaces/IHandler';
import { EndCommand } from './commands/EndCommand';
import { StartAiChatCallbackHandler } from './events/StartAiChatCallbackHandler';
import { ConversationMessageHandler } from './events/ConversationMessageHandler';
import { IChatService } from './interfaces/IChatService';
import { ChatService } from './implementations/ChatService';
import { Express } from 'express';

export default class AiChatFeature implements IFeatureModule {
  public readonly name = 'ai-chat';

  public register(container: DependencyContainer): void {
    container.register(ICommand, { useClass: EndCommand });
    container.register(ICallbackQueryHandler, { useClass: StartAiChatCallbackHandler });
    container.register(IMessageHandler, { useClass: ConversationMessageHandler });
    container.registerSingleton<IChatService>(IChatService, ChatService);
  }

  public initialize(_botId: string, bot: Bot<BotContext>, container: DependencyContainer, _app: Express): void {
    const commands = container.resolveAll<ICommand>(ICommand);
    commands.forEach(handler => bot.command(handler.command, (ctx) => handler.handle(ctx)));

    const callbackHandlers = container.resolveAll<ICallbackQueryHandler>(ICallbackQueryHandler);
    callbackHandlers.forEach(handler => bot.callbackQuery(handler.trigger, (ctx) => handler.handle(ctx)));

    const messageHandlers = container.resolveAll<IMessageHandler>(IMessageHandler);
    bot.on('message:text', async (ctx) => {
        if (ctx.message.text.startsWith('/')) return;
        for (const handler of messageHandlers) {
            if (handler.canHandle(ctx)) {
                await handler.handle(ctx);
                return;
            }
        }
    });
  }
}