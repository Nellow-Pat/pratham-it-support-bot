export class Config {
  public readonly telegramBotToken: string;
  public readonly logLevel: "error" | "warn" | "info" | "debug";
  public readonly logDirectory: string;
  public readonly aiApiBaseUrl: string;
  public readonly aiApiUsername: string;
  public readonly aiApiPassword: string;

  constructor(
    token: string,
    logLevel: "error" | "warn" | "info" | "debug",
    logDirectory: string,
    aiApiBaseUrl: string,
    aiApiUsername: string,
    aiApiPassword: string
  ) {
    this.telegramBotToken = token;
    this.logLevel = logLevel;
    this.logDirectory = logDirectory;
    this.aiApiBaseUrl = aiApiBaseUrl;
    this.aiApiUsername = aiApiUsername;
    this.aiApiPassword = aiApiPassword;
  }
}
