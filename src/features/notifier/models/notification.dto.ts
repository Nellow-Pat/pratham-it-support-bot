import { z } from 'zod';
import { DynamicViewDataSchema } from '@/shared/dynamic-views/models/dynamic-view.dto';

export const NotificationRequestSchema = z.object({
  chatId: z.union([z.string().min(1), z.number()]),
  view: DynamicViewDataSchema,
});

export type NotificationRequest = z.infer<typeof NotificationRequestSchema>;