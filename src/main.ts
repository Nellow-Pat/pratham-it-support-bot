import 'reflect-metadata';
import { container } from '@/container';
import { LoggerService } from '@/utils/logger';
import { IBotService } from '@/bot/base/interfaces/IBotService';
import { HandlerRegistry } from '@/bot/chat/services/HandlerRegistry';
import { IAuthService } from '@/bot/chat/interfaces/IAuthService';


async function bootstrap() {
  const logger = container.resolve(LoggerService);
  logger.info('Pratham IT support bot is starting...');

  try {
    const authService = container.resolve<IAuthService>(IAuthService);
    await authService.login();
  } catch (error) {
    logger.error('Fatal: API authentication failed. Shutting down.');
    process.exit(1);
  }

  const handlerRegistry = container.resolve(HandlerRegistry);
  handlerRegistry.initializeHandlers();

  const botService = container.resolve<IBotService>(IBotService);
  await botService.start();

  logger.info('Bot is now running and polling for updates.');
}

bootstrap().catch((error) => {
  const logger = container.isRegistered(LoggerService)
    ? container.resolve(LoggerService)
    : console;

  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Application failed to start: ${errorMessage}`, error);
  process.exit(1);
});