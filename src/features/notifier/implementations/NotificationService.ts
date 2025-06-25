import { injectable, inject } from 'tsyringe';
import { Bot } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { LoggerService } from '@/utils/logger';
import { toError } from '@/utils/ErrorUtils';
import { INotificationService } from '../interfaces/INotificationService';
import { NotificationRequest } from '../models/notification.dto';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(Bot) private readonly bot: Bot<BotContext>,
  ) {}

  public async sendNotification(request: NotificationRequest): Promise<void> {
    try {
      this.logger.info(`Sending notification to chat ID: ${request.chatId}`);
      await this.bot.api.sendMessage(request.chatId, request.message, request.options);
      this.logger.info(`Successfully sent notification to chat ID: ${request.chatId}`);
    } catch (e) {
      const error = toError(e);
      this.logger.error(`Failed to send notification to ${request.chatId}: ${error.message}`, error);
      throw error;
    }
  }
}