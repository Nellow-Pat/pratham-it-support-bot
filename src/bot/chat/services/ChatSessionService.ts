import { singleton, injectable } from 'tsyringe';
import { IChatSessionService } from '../interfaces/IChatSessionService';

@singleton()
@injectable()
export class ChatSessionService implements IChatSessionService {
  // in-memory store: Map<telegram_user_id, backend_chat_id>
  private readonly sessions = new Map<number, string>();

  public createSession(telegramUserId: number, backendChatId: string): void {
    this.sessions.set(telegramUserId, backendChatId);
  }

  public getSessionId(telegramUserId: number): string | undefined {
    return this.sessions.get(telegramUserId);
  }

  public endSession(telegramUserId: number): boolean {
    return this.sessions.delete(telegramUserId);
  }
}