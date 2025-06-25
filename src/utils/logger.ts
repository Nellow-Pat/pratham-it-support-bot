import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { singleton, inject } from 'tsyringe';
import { Config } from '@/config';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

@singleton()
export class LoggerService {
  private readonly logLevel: number;
  private readonly logDir: string;

  constructor(@inject(Config) private readonly config: Config) {
    this.logLevel = LOG_LEVELS[this.config.logLevel];
    this.logDir = path.resolve(process.cwd(), this.config.logDirectory);
    this.initializeLogDir();
  }

  private initializeLogDir(): void {
    try {
      fs.mkdirSync(this.logDir, { recursive: true });
    } catch (error) {
      console.error(`Fatal: Could not create log directory at ${this.logDir}`, error);
      process.exit(1);
    }
  }

  private async logToFile(level: LogLevel, message: string): Promise<void> {
    const filePath = path.join(this.logDir, `${level}.log`);
    const logMessage = `${message}\n`;
    try {
      await fsPromises.appendFile(filePath, logMessage, 'utf-8');
    } catch (error) {
      console.error(`Failed to write to log file: ${filePath}`, error);
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: object): string {
    const timestamp = new Date().toISOString();
    const formattedMeta = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedMeta}`;
  }

  public debug(message: string, meta?: object): void {
    if (this.logLevel >= LOG_LEVELS.debug) {
      const formatted = this.formatMessage('debug', message, meta);
      console.debug(formatted);
      this.logToFile('debug', formatted);
    }
  }

  public info(message: string, meta?: object): void {
    if (this.logLevel >= LOG_LEVELS.info) {
      const formatted = this.formatMessage('info', message, meta);
      console.info(formatted);
      this.logToFile('info', formatted);
    }
  }

  public warn(message: string, meta?: object): void {
    if (this.logLevel >= LOG_LEVELS.warn) {
      const formatted = this.formatMessage('warn', message, meta);
      console.warn(formatted);
      this.logToFile('warn', formatted);
    }
  }

  public error(message: string, error?: Error | object): void {
    if (this.logLevel >= LOG_LEVELS.error) {
      const meta = error instanceof Error ? { message: error.message, stack: error.stack } : error;
      const formatted = this.formatMessage('error', message, meta);
      console.error(formatted);
      this.logToFile('error', formatted);
    }
  }
}