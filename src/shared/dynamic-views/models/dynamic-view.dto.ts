import { z } from 'zod';
import { buttonSchema } from '@/features/core-commands/factories/NavigationalViewFactory';


export const DynamicViewDataSchema = z.object({
  title: z.string().optional(),
  image_url: z.string().url().optional(),
  body: z.array(z.string()),
  buttons: z.array(buttonSchema).optional(), 
});

export type DynamicViewData = z.infer<typeof DynamicViewDataSchema>;