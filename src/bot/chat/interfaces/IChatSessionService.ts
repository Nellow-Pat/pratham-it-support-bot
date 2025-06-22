export const IChatSessionService = Symbol('IChatSessionService');

export interface IChatSessionService {
  createSession(telegramUserId: number, backendChatId: string): void;
  
  getSessionId(telegramUserId: number): string | undefined;

  endSession(telegramUserId: number): boolean;
}