import { Request, Response } from 'express';
import { injectable, inject, singleton } from 'tsyringe';
import { LoggerService } from '@/utils/logger';
import { WebAppResponse } from '@/bot/web-app/models/response.model';
import { WebAppParserRegistry } from '@/bot/web-app/services/WebAppParserRegistry';
import { User } from 'grammy/types';

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
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const { payload, initData } = req.body as WebhookRequestBody;
      this.logger.info(`Received webhook for type: "${payload.type}"`);

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

  private createSyntheticContext(initData: string, res: Response): any {
    const params = new URLSearchParams(initData);
    const user = JSON.parse(params.get('user') || '{}') as User;
    return {
      from: user,
      reply: async (text: string, _options?: any) => {
        if (!res.headersSent) {
          res.status(200).json({ success: true, reply: text });
        }
      },
      deleteMessage: async () => Promise.resolve(true),
    };
  }
}