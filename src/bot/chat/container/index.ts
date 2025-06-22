import { DependencyContainer } from 'tsyringe';
import { ChatService } from '../services/ChatService';
import { IChatService } from '../interfaces/IChatService';
import { MessageLoaderFactory } from '../factories/MessageLoaderFactory';
import { WelcomeView } from '../views/WelcomeView';
import { StartCommand } from '../commands/StartCommand';
import { ICommand } from '../interfaces/ICommand';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthService } from '../services/AuthService';

export function registerChatServices(container: DependencyContainer): void {
  container.register(IChatService, {
    useClass: ChatService,
  });

  container.register<MessageLoaderFactory>(MessageLoaderFactory, {
    useClass: MessageLoaderFactory,
  });

  container.register<WelcomeView>(WelcomeView, {
    useClass: WelcomeView,
  });

  container.register(ICommand, {
    useClass: StartCommand,
  });
  container.registerSingleton(IAuthService, AuthService);
}