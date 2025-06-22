import { injectable, inject, singleton } from 'tsyringe';
import { Config } from '@/models/config.model';
import { ApiService } from '@/api/services/ApiService';
import { LoggerService } from '@/utils/logger';
import { LoginRequest, LoginResponse } from '@/api/models/auth.dto';
import { LOGIN_USER_ENDPOINT } from '@/api/constants/chat.auth.endpoints';
import { IAuthService } from '../interfaces/IAuthService';

@singleton()
@injectable()
export class AuthService implements IAuthService {
  private accessToken: string | null = null;

  constructor(
    @inject(ApiService) private readonly apiService: ApiService,
    @inject(Config) private readonly config: Config,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public async login(): Promise<void> {
    this.logger.info('Attempting to log in to the AI API...');
    try {
      const payload: LoginRequest = {
        name: this.config.aiApiUsername,
        password: this.config.aiApiPassword,
      };

      this.logger.info(
        `Logging in with username: ${payload.name}, password: ${payload.password}`);
      

      const response = await this.apiService.post<LoginResponse>(
        LOGIN_USER_ENDPOINT,
        payload,
      );

      this.accessToken = response.access_token;
      this.logger.info('Successfully logged in to the AI API.');
    } catch (error) {
      this.logger.error('Failed to log in to the AI API.');
      throw new Error('Could not authenticate with the backend service.');
    }
  }
}