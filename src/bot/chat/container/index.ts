import { DependencyContainer } from 'tsyringe';

import { ChatService } from '../services/ChatService';
import { IChatService } from '../interfaces/IChatService';
import { IChatSessionService } from '../interfaces/IChatSessionService';
import { ChatSessionService } from '../services/ChatSessionService';

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
import { IMenuViewService } from '../interfaces/IMenuViewService';
import { MenuViewService } from '../services/MenuViewService';
import { NavigationViewCallbackHandler } from '../handlers/NavigationViewCallbackHandler';
import { NavigationalViewFactory } from '../factories/NavigationalViewFactory';
import { MenuView } from '../views/MenuView';


export function registerChatServices(container: DependencyContainer): void {

  container.registerSingleton(IAuthService, AuthService);
  container.registerSingleton(IChatService, ChatService);
  container.registerSingleton(IChatSessionService, ChatSessionService);

  
  container.registerSingleton(IMenuViewService, MenuViewService);
  container.register(NavigationalViewFactory, { useClass: NavigationalViewFactory });
  container.register(MenuView, { useClass: MenuView });


  container.register(ICommand, { useClass: StartCommand });
  container.register(ICommand, { useClass: EndCommand });

  container.register(ICallbackQueryHandler, { 
    useClass: StartAiChatCallbackHandler,
  });
  container.register(ICallbackQueryHandler, { useClass: NavigationViewCallbackHandler });

  container.register(IMessageHandler, { 
    useClass: ConversationMessageHandler,
  });
}