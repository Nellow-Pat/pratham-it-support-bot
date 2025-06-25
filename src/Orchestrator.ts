import { DependencyContainer, injectable, inject } from 'tsyringe';
import { BotInstance } from './core/BotInstance';
import { IFeatureModule } from './core/interfaces/IFeatureModule';
import { Config } from './config';
import { LoggerService } from './utils/logger';
import { loadFeatures } from './utils/FeatureLoader';
import { IAuthService } from './shared/api/interfaces/IAuthService';
import { toError } from './utils/ErrorUtils';
import { IServer } from './shared/server/interfaces/IServer';
import { Server } from './shared/server/implementations/Server';
@injectable()
export class Orchestrator {
  private readonly botInstances: BotInstance[] = [];
  private featureRegistry: Map<string, IFeatureModule> = new Map();

  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(Config) private readonly config: Config,
    @inject('MainContainer') private readonly container: DependencyContainer,
    @inject(IAuthService) private readonly authService: IAuthService,
    @inject(IServer) private readonly server: IServer,
  ) {}

  public async run(): Promise<void> {
    this.logger.info('Starting Pratham IT Bot Orchestrator...');

    try {
      await this.config.loadBotConfigs();
      this.featureRegistry = await loadFeatures(this.container);
      await this.authService.login();
    } catch (e) {
      const error = toError(e);
      this.logger.error(`Fatal application startup error: ${error.message}`, error);
    }

    this.server.start();
    const expressApp = (this.server as Server).expressApp; 

    const botConfigs = this.config.getBotConfigs();
    for (const botConfig of botConfigs) {
      try {
        const instance = new BotInstance(botConfig, this.container, this.featureRegistry, expressApp);
        this.botInstances.push(instance);
        instance.start();
      } catch (e) {
        const error = toError(e);
        this.logger.error(`Failed to initialize bot: ${botConfig.id}. Error: ${error.message}`, error);
      }
    }

    this.setupGracefulShutdown();
    this.logger.info(`Orchestrator is running with ${this.botInstances.length} bot(s).`);
  }

  private setupGracefulShutdown(): void {
    const stopAllBots = async () => {
      this.logger.warn('SIGINT/SIGTERM received. Shutting down all bots...');
      await Promise.all(this.botInstances.map(bot => bot.stop()));
      this.logger.info('All bots have been stopped.');
      process.exit(0);
    };

    process.once('SIGINT', stopAllBots);
    process.once('SIGTERM', stopAllBots);
  }
}