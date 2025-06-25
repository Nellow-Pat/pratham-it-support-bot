import express, { Express } from 'express';
import { injectable, inject, singleton } from 'tsyringe';
import cors from 'cors';
import { Config } from '@/config';
import { LoggerService } from '@/utils/logger';
import { webhookRouter } from '../routes/webhook.route';
import { IServer } from '../interfaces/IServer';

@injectable()
@singleton()
export class Server implements IServer {
  private readonly app: Express;
  public get expressApp(): Express {
    return this.app;
  }

  constructor(
    @inject(Config) private readonly config: Config,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.app = express();
    this.app.use(cors({ origin: this.config.webAppUrl }));
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