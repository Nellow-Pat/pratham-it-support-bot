import { z } from 'zod';

export const NotificationRequestSchema = z.object({
  chatId: z.union([z.string().min(1), z.number()]),
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
  options: z.object({
    parse_mode: z.enum(['Markdown', 'HTML']).optional(),
  }).optional(),
});

export type NotificationRequest = z.infer<typeof NotificationRequestSchema>;