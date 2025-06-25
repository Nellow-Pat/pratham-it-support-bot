import 'reflect-metadata';
import { container } from '@/container';
import { Orchestrator } from '@/Orchestrator';
import { LoggerService } from '@/utils/logger';
import { toError } from './utils/ErrorUtils';

async function bootstrap() {
  const app = container.resolve(Orchestrator);
  await app.run();
}

bootstrap().catch((e) => {
  const error = toError(e);
  const logger = container.isRegistered(LoggerService)
    ? container.resolve(LoggerService)
    : console;

  logger.error(`Application failed to start: ${error.message}`, error);
  process.exit(1);
});