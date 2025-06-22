import { DependencyContainer } from 'tsyringe';

import { ChatService } from '../services/ChatService';
import { IChatService } from '../interfaces/IChatService';
import { IChatSessionService } from '../interfaces/IChatSessionService';
import { ChatSessionService } from '../services/ChatSessionService';

import { MessageLoaderFactory } from '../factories/MessageLoaderFactory';
import { WelcomeView } from '../views/WelcomeView';
import {
  ICommand,
  ICallbackQueryHandler,
  IMessageHandler,
} from '@/bot/base/interfaces/IHandler';
import { StartCommand } from '../commands/StartCommand';
import { EndCommand } from '../commands/EndCommand';
import { StartAiChatCallbackHandler } from '../handlers/StartAiChatCallbackHandler';
import { ConversationMessageHandler } from '../handlers/ConversationMessageHandler';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthService } from '../services/AuthService';

export function registerChatServices(container: DependencyContainer): void {

  container.registerSingleton(IAuthService, AuthService);
  container.registerSingleton(IChatService, ChatService);
  container.registerSingleton(IChatSessionService, ChatSessionService);

  container.register(MessageLoaderFactory, { useClass: MessageLoaderFactory });
  container.register(WelcomeView, { useClass: WelcomeView });


  container.register(ICommand, { useClass: StartCommand });
  container.register(ICommand, { useClass: EndCommand });

  container.register(ICallbackQueryHandler, { 
    useClass: StartAiChatCallbackHandler,
  });

  container.register(IMessageHandler, { 
    useClass: ConversationMessageHandler,
  });
}