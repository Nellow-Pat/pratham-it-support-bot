import { DependencyContainer } from 'tsyringe';
import { Server } from './implementations/Server';
import { WebhookController } from './implementations/WebhookController';
import { IServer } from './interfaces/IServer';

export function registerServerModule(container: DependencyContainer): void {
  container.registerSingleton<IServer>(IServer, Server);
  container.registerSingleton(WebhookController);
}