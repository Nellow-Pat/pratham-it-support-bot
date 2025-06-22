import { container } from 'tsyringe';
import { Config } from '@/models/config.model';
import { config } from '@/config';
import { LoggerService } from '@/utils/logger';
import { registerApiServices } from '@/api/container';
import { registerBaseBotServices } from '@/bot/base/container';
import { registerChatServices } from '@/bot/chat/container';
import { Application } from '@/Application';

container.register(Application, { useClass: Application });

container.register<Config>(Config, { useValue: config });
container.registerSingleton(LoggerService);

registerApiServices(container);
registerBaseBotServices(container);
registerChatServices(container);

export { container };