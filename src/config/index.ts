import { Config } from '@/models/config.model';
import dotenv from 'dotenv';
import { z } from 'zod';


dotenv.config();

const configSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'Telegram bot token is required.'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIRECTORY: z.string().default('logs'),
});

const parsedEnv = configSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

const env = parsedEnv.data;

export const config = new Config(
  env.TELEGRAM_BOT_TOKEN,
  env.LOG_LEVEL,
  env.LOG_DIRECTORY,
);