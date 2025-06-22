import 'reflect-metadata';
import { container } from '@/container';
import { LoggerService } from '@/utils/logger';
import { Config } from '@/models/config.model';

async function bootstrap() {
  const logger = container.resolve(LoggerService);
  const appConfig = container.resolve(Config);

  logger.info('Pratham IT support bot is starting...');
  logger.info('Configuration loaded successfully.');
  logger.debug('Loaded configuration values', {
    logLevel: appConfig.logLevel,
    logDir: appConfig.logDirectory,
  });
}

bootstrap().catch((error) => {
  const logger = container.isRegistered(LoggerService)
    ? container.resolve(LoggerService)
    : console;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Application failed to start: ${errorMessage}`, error);
  process.exit(1);
});