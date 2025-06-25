import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { LoggerService } from '@/utils/logger';
import { toError } from '@/utils/ErrorUtils';
import { INotificationService } from '../interfaces/INotificationService';
import { NotificationRequestSchema } from '../models/notification.dto';

@injectable()
export class NotificationController {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(INotificationService) private readonly notificationService: INotificationService,
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const validation = NotificationRequestSchema.safeParse(req.body);

    if (!validation.success) {
      this.logger.warn('Invalid notification request received.', validation.error.flatten());
      res.status(400).json({ success: false, errors: validation.error.flatten() });
      return;
    }

    try {
      await this.notificationService.sendNotification(validation.data);
      res.status(200).json({ success: true, message: 'Notification sent successfully.' });
    } catch (e) {
      const error = toError(e);
      this.logger.error('Notification controller failed to handle request.', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
}