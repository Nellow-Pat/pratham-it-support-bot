import { container } from 'tsyringe';
import { config } from '@/config';
import { Config } from '@/models/config.model';
import { LoggerService } from '@/utils/logger';
import { registerBaseBotServices } from '@/bot/base/container';

container.register<Config>(Config, { useValue: config });
container.register<LoggerService>(LoggerService, {
  useClass: LoggerService,
});

registerBaseBotServices(container);

export { container };