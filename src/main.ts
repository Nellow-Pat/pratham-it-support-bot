import 'reflect-metadata';
import { container } from '@/container';
import { Application } from '@/Application';
import { LoggerService } from './utils/logger';

async function bootstrap() {
  const app = container.resolve(Application);
  
  await app.run();
}

bootstrap().catch((error) => {
  const logger = container.isRegistered(LoggerService)
    ? container.resolve(LoggerService)
    : console;

  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Application failed to start: ${errorMessage}`, error);
  process.exit(1);
});