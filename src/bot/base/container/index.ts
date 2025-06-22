import { DependencyContainer } from 'tsyringe';
import { BotFactory } from '../factories/BotFactory';
import { BotService } from '../services/BotService';
import { IBotService } from '../interfaces/IBotService';
import { HandlerRegistry } from '@/bot/chat/services/HandlerRegistry';

export function registerBaseBotServices(container: DependencyContainer): void {
  container.register<BotFactory>(BotFactory, {
    useClass: BotFactory,
  });
  container.registerSingleton<IBotService>(IBotService, BotService);

  container.registerSingleton(HandlerRegistry);
}