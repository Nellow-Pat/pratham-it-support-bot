import { injectable, inject, singleton } from "tsyringe";
import { BotContext } from "@/bot/models/context.model";
import { LoggerService } from "@/utils/logger";
import { IChatService } from "../interfaces/IChatService";
import { MessageLoaderFactory } from "../factories/MessageLoaderFactory";
import { WelcomeView } from "../views/WelcomeView";
import { IChatSessionService } from '../interfaces/IChatSessionService';
import { ApiService } from '@/api/services/ApiService';
import {
  CreateChatRequest,
  CreateChatSessionResponse,
  StreamChatRequest,
} from '@/api/models/chat.dto';
import {
  CREATE_CHAT_ENDPOINT,
  STREAM_CHAT_ENDPOINT,
} from '@/api/constants/chat.auth.endpoints';
import { CallbackQueryContext } from "grammy";

@singleton()
@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(MessageLoaderFactory)
    private readonly messageLoader: MessageLoaderFactory,
    @inject(WelcomeView) private readonly welcomeView: WelcomeView,
    @inject(IChatSessionService)
    private readonly sessionService: IChatSessionService,
    @inject(ApiService) private readonly apiService: ApiService,
  ) {}

   public async sendWelcomeMessage(ctx: BotContext): Promise<void> {
    try {
      const greeting = await this.messageLoader.loadInitialGreeting();
      const keyboard = this.welcomeView.build({
        buttons: greeting.buttons,
      });

      const message = `*${greeting.title}*\n\n${greeting.body}`;

      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });

      this.logger.info(`Sent welcome message to user ${ctx.from?.id}`);
    } catch (error) {
      this.logger.error('Failed to send welcome message');
      await ctx.reply('Sorry, something went wrong. Please try again later.');
    }
  }
   public async initiateChat(ctx: CallbackQueryContext<BotContext>): Promise<void> {
    if (!ctx.from) return;
    await ctx.answerCallbackQuery();

    try {
      this.logger.info(`Attempting to start a new chat session for user ${ctx.from.id}`);
      
      const createPayload: CreateChatRequest = { query: 'Start a new conversation' };
      
      const session = await this.apiService.post<CreateChatSessionResponse>(
        CREATE_CHAT_ENDPOINT,
        createPayload,
      );

      this.sessionService.createSession(ctx.from.id, session.id);
      this.logger.info(`Started new chat session ${session.id} for user ${ctx.from.id}`);
      await ctx.reply("Hello! What can I help you with? You can end our chat at any time by sending /end.");

    } catch (error) {
      this.logger.error(`Failed to initiate chat for user ${ctx.from.id}`);
      await ctx.reply('Sorry, I couldn\'t start a new chat session right now. Please try again later.');
    }
  }

  public async handleConversation(ctx: BotContext): Promise<void> {
    if (!ctx.from || !ctx.message?.text) return;
    const userId = ctx.from.id;
    const chatId = this.sessionService.getSessionId(userId);

    if (!chatId) {
      await ctx.reply("It seems we're not in a chat session. Please use the menu to start a new chat.");
      return;
    }
    
    await ctx.replyWithChatAction('typing');

    try {
      const payload: StreamChatRequest = { query: ctx.message.text, chat_id: chatId };
      const stream = await this.apiService.streamPost(STREAM_CHAT_ENDPOINT, payload);
      
      const fullResponse = await this.consumeStream(stream);
      
      await ctx.reply(fullResponse || "I don't have a response for that right now.");
    } catch (error) {
      this.logger.error(`Error during conversation for user ${userId}`);
      await ctx.reply('An error occurred while getting a response. Please try again.');
    }
  }

  private async consumeStream(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value);
    }
    return fullText;
  }
}
