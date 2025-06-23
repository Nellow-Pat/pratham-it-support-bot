import { injectable, inject, injectAll, singleton } from 'tsyringe';
import { IBotService } from '@/bot/base/interfaces/IBotService';
import { LoggerService } from '@/utils/logger';
import { IWebAppParser } from '../interfaces/IWebAppParser';
import { WebAppDataContext } from '../models/context.model';
import { WebAppResponse } from '../models/response.model';

@singleton()
@injectable()
export class WebAppParserRegistry {
  private readonly parsers: Map<string, IWebAppParser<unknown>>;

  constructor(
    @inject(IBotService) private readonly botService: IBotService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @injectAll(IWebAppParser) allParsers: IWebAppParser<unknown>[],
  ) {
    this.parsers = new Map(allParsers.map((p) => [p.dataType, p]));
  }

  public initializeListener(): void {
    this.logger.info(
      `Initializing Web App data listener. Found ${this.parsers.size} parsers.`,
    );
    try {
      this.botService
      .getBotInstance()
      .on('message:web_app_data', (ctx) => this.route(ctx));
      this.logger.info('Web App data listener initialized successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Web App data listener', { error });
    }
  }

  private async route(ctx: WebAppDataContext): Promise<void> {
    try {
      const rawData = ctx.message.web_app_data.data;
      const response = JSON.parse(rawData) as WebAppResponse<unknown>;
      this.logger.info('Received raw Web App data string:', { rawData });
      
      this.logger.info('Parsed Web App response object:', { response });

      const parser = this.parsers.get(response.type);
      

      if (!parser) {
        this.logger.warn(`No parser found for Web App data type: "${response.type}"`);
        return;
      }

      this.logger.info(`Routing Web App data type "${response.type}" to its parser.`);
      await parser.parseAndHandle(ctx, response.data);
    } catch (error) {
      this.logger.error('Failed to parse or handle Web App data');
      await ctx.reply('Sorry, there was an issue processing the data from the app.');
    }
  }
}