import { Config } from "@/models/config.model";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Telegram bot token is required."),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_DIRECTORY: z.string().default("logs"),
  AI_API_BASE_URL: z.string().url("AI_API_BASE_URL must be a valid URL."),
  AI_API_USERNAME: z.string().min(1, "AI_API_USERNAME is required."),
  AI_API_PASSWORD: z.string().min(1, "AI_API_PASSWORD is required."),
});

const parsedEnv = configSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables.");
}

const env = parsedEnv.data;

export const config = new Config(
  env.TELEGRAM_BOT_TOKEN,
  env.LOG_LEVEL,
  env.LOG_DIRECTORY,
  env.AI_API_BASE_URL,
  env.AI_API_USERNAME,
  env.AI_API_PASSWORD,
);