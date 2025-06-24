import { Request, Response } from 'express';
import { injectable, inject, singleton } from 'tsyringe';
import { LoggerService } from '@/utils/logger';
import { WebAppResponse } from '@/bot/web-app/models/response.model';
import { WebAppParserRegistry } from '@/bot/web-app/services/WebAppParserRegistry';
import { User } from 'grammy/types';
import { ParserContext } from '@/bot/web-app/models/parser-context.model';
import { IBotService } from '@/bot/base/interfaces/IBotService';

interface WebhookRequestBody {
  payload: WebAppResponse<unknown>;
  initData: string;
}

@singleton()
@injectable()
export class WebhookController {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(WebAppParserRegistry) private readonly parserRegistry: WebAppParserRegistry,
    @inject(IBotService) private readonly botService: IBotService,
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { payload, initData } = req.body as WebhookRequestBody;
      this.logger.debug(`Received webhook for type: "${payload.type}"`);

      const parser = (this.parserRegistry as any).parsers.get(payload.type);

      if (!parser) {
        this.logger.warn(`No parser found for webhook data type: "${payload.type}"`);
        res.status(404).json({ success: false, message: 'Parser not found' });
        return;
      }

      const syntheticCtx = this.createSyntheticContext(initData, res);

      await parser.parseAndHandle(syntheticCtx, payload.data);

    } catch (error) {
      this.logger.error('Error handling custom webhook');
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

 private createSyntheticContext(initData: string, res: Response): ParserContext {
    const params = new URLSearchParams(initData);
    const user = JSON.parse(params.get('user') || '{}') as User;
    const bot = this.botService.getBotInstance();

    return {
      from: user,
      reply: async (text: string, options?: any) => {
        if (!res.headersSent) {
          res.status(200).json({ success: true, message: 'Data processed.' });
        }
        if (user.id) {
            await bot.api.sendMessage(user.id, text, options);
        }
      },
    };
  }
}