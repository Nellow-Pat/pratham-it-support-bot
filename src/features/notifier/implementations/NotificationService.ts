import { injectable, inject } from 'tsyringe';
import { LoggerService } from '@/utils/logger';
import { toError } from '@/utils/ErrorUtils';
import { INotificationService } from '../interfaces/INotificationService';
import { NotificationRequest } from '../models/notification.dto';
import { IDynamicViewService } from '@/shared/dynamic-views/interfaces/IDynamicViewService';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(IDynamicViewService) private readonly dynamicViewService: IDynamicViewService,
  ) {}

  public async sendNotification(request: NotificationRequest): Promise<void> {
    try {
      this.logger.info(`Sending dynamic view notification to chat ID: ${request.chatId}`);
      
      await this.dynamicViewService.sendViewToChat(request.chatId, request.view);

      this.logger.info(`Successfully sent notification to chat ID: ${request.chatId}`);
    } catch (e) {
      const error = toError(e);
      this.logger.error(`Failed to send notification to ${request.chatId}: ${error.message}`, error);
      throw error;
    }
  }
}