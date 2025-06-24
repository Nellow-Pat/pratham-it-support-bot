import { injectable, inject } from 'tsyringe';
import { IAuthService } from '@/bot/chat/interfaces/IAuthService';
import { HandlerRegistry } from '@/bot/base/services/HandlerRegistry';
import { IBotService } from '@/bot/base/interfaces/IBotService';
import { LoggerService } from '@/utils/logger';
import { WebAppParserRegistry } from '@/bot/web-app/services/WebAppParserRegistry';
import { Server } from './server/Server';

@injectable()
export class Application {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(IAuthService) private readonly authService: IAuthService,
    @inject(HandlerRegistry) private readonly handlerRegistry: HandlerRegistry,
    @inject(IBotService) private readonly botService: IBotService,
    @inject(WebAppParserRegistry) private readonly webAppRegistry: WebAppParserRegistry,
    @inject(Server) private readonly server: Server,
  ) {}

  public async run(): Promise<void> {
    this.logger.info('Pratham IT support bot is starting...');

    try {
      await this.authService.login();
    } catch (error) {
      this.logger.error('Fatal: API authentication failed.');
      //process.exit(1);
    }

    this.server.start();

    this.handlerRegistry.initializeHandlers();
    this.webAppRegistry.initializeListener();

    await this.botService.start();

    this.logger.info('Bot is now running and polling for updates.');
  }
}