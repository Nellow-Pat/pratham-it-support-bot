import express, { Express } from 'express';
import { injectable, inject, singleton } from 'tsyringe';
import { Config } from '@/models/config.model';
import { LoggerService } from '@/utils/logger';
import { webhookRouter } from './routes/webhook.route';


@singleton()
@injectable()
export class Server {
  public readonly app: Express;

  constructor(
    @inject(Config) private readonly config: Config,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.app = express();
    this.app.use(express.json());
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.app.use('/webhook', webhookRouter);
  }

  public start(): void {
    const port = this.config.webServerPort;
    this.app.listen(port, () => {
      this.logger.info(`Webhook server listening on http://localhost:${port}`);
    });
  }
}