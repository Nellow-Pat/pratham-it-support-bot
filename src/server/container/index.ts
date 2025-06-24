import { DependencyContainer } from 'tsyringe';
import { Server } from '../Server';
import { WebhookController } from '../controllers/WebhookController';

export function registerServerServices(container: DependencyContainer): void {
  container.registerSingleton(Server);
  container.registerSingleton(WebhookController);
}