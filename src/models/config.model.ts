export class Config {
  public readonly telegramBotToken: string;
  public readonly logLevel: 'error' | 'warn' | 'info' | 'debug';
  public readonly logDirectory: string;

  constructor(
    token: string,
    logLevel: 'error' | 'warn' | 'info' | 'debug',
    logDirectory: string,
  ) {
    this.telegramBotToken = token;
    this.logLevel = logLevel;
    this.logDirectory = logDirectory;
  }
}