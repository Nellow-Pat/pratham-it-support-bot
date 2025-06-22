import { injectable, inject, singleton } from "tsyringe";
import { BotContext } from "@/bot/models/context.model";
import { LoggerService } from "@/utils/logger";
import { IChatService } from "../interfaces/IChatService";
import { MessageLoaderFactory } from "../factories/MessageLoaderFactory";
import { WelcomeView } from "../views/WelcomeView";

@singleton()
@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(MessageLoaderFactory)
    private readonly messageLoader: MessageLoaderFactory,
    @inject(WelcomeView) private readonly welcomeView: WelcomeView
  ) {}

  public async sendWelcomeMessage(ctx: BotContext): Promise<void> {
    try {
      const greeting = await this.messageLoader.loadInitialGreeting();
      const keyboard = this.welcomeView.build({
        buttonText: greeting.button_text,
      });

      const message = `*${greeting.title}*\n\n${greeting.body}`;

      await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });

      this.logger.info(`Sent welcome message to user ${ctx.from?.id}`);
    } catch (error) {
      this.logger.error(
        "Failed to send welcome message",
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : { error: String(error) }
      );

      await ctx.reply("Sorry, something went wrong. Please try again later.");
    }
  }
}
