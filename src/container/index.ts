import { container } from 'tsyringe';
import { config } from '@/config';
import { Config } from '@/models/config.model';
import { LoggerService } from '@/utils/logger';
import { registerBaseBotServices } from '@/bot/base/container';
import { registerChatServices } from '@/bot/chat/container'; 
import { registerApiServices } from '@/api/container';

container.register<Config>(Config, { useValue: config });
container.register<LoggerService>(LoggerService, {
  useClass: LoggerService,
});

registerApiServices(container);
registerBaseBotServices(container);
registerChatServices(container);

export { container };