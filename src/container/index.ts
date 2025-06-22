import { container } from 'tsyringe';
import { config } from '@/config';
import { LoggerService } from '@/utils/logger';
import { Config } from '@/models/config.model';

container.register<Config>(Config, { useValue: config });

container.register<LoggerService>(LoggerService, {
  useClass: LoggerService,
});

export { container };