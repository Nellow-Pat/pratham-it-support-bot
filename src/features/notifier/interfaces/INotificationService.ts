import { NotificationRequest } from '../models/notification.dto';

export const INotificationService = Symbol('INotificationService');

export interface INotificationService {
  sendNotification(request: NotificationRequest): Promise<void>;
}