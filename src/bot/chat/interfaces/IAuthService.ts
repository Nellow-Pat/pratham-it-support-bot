export const IAuthService = Symbol('IAuthService');

export interface IAuthService {
  login(): Promise<void>;
  getAccessToken(): string | null;
}