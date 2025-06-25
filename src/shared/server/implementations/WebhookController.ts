import { Request, Response } from 'express';
import { injectable, inject, singleton, DependencyContainer } from 'tsyringe';
import { User } from 'grammy/types';
import { Bot } from 'grammy';
import { LoggerService } from '@/utils/logger';
import { WebAppResponse } from '@/features/web-app/models/response.model';
import { ParserContext } from '@/features/web-app/models/parser-context.model';
import { WebAppParserRegistry } from '@/features/web-app/implementations/WebAppParserRegistry';
import { toError } from '@/utils/ErrorUtils';
import { BotContext } from '@/core/models/context.model';

interface WebhookRequestBody {
  payload: WebAppResponse<unknown>;
  initData: string;
}

@injectable()
@singleton()
export class WebhookController {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const botId = req.params.botId;
      
      const { payload, initData } = req.body as WebhookRequestBody;
      this.logger.debug(`[${botId}] Received webhook for type: "${payload.type}"`);

      const parserRegistry = req.container.resolve(WebAppParserRegistry);
      const parser = parserRegistry.parsers.get(payload.type);

      if (!parser) {
        this.logger.warn(`[${botId}] No parser found for webhook data type: "${payload.type}"`);
        res.status(404).json({ success: false, message: 'Parser not found' });
        return;
      }

      const syntheticCtx = this.createSyntheticContext(req.container, initData, res);
      await parser.parseAndHandle(syntheticCtx, payload.data);

    } catch (e) {
      const error = toError(e);
      this.logger.error('Error handling custom webhook', error);
      if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  }

  private createSyntheticContext(container: DependencyContainer, initData: string, res: Response): ParserContext {
    const params = new URLSearchParams(initData);
    const user = JSON.parse(params.get('user') || '{}') as User;
    const bot = container.resolve<Bot<BotContext>>(Bot);

    return {
      from: user,
      reply: async (text: string, options?: any) => {
        if (!res.headersSent) {
          res.status(200).json({ success: true, message: 'Data processed.' });
        }
        if (user?.id) {
          await bot.api.sendMessage(user.id, text, options);
        }
      },
    };
  }
}