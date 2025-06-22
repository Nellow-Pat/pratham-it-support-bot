import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import { singleton, inject, container } from 'tsyringe';
import { Config } from '@/models/config.model';
import { LoggerService } from '@/utils/logger';
import { IAuthService } from '@/bot/chat/interfaces/IAuthService';
import { ApiResponse } from '../models/api.dto';
import { LOGIN_USER_ENDPOINT } from '../constants/chat.auth.endpoints';

@singleton()
export class ApiService {
  private readonly client: AxiosInstance;

  constructor(
    @inject(Config) private readonly config: Config,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.client = axios.create({
      baseURL: this.config.aiApiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(this.requestInterceptor.bind(this));
    this.client.interceptors.response.use(
      this.responseSuccessInterceptor,
      this.responseErrorInterceptor.bind(this),
    );
  }

  private requestInterceptor(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    if (config.url === LOGIN_USER_ENDPOINT) {
      return config;
    }

    const authService = container.resolve<IAuthService>(IAuthService);
    const token = authService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private responseSuccessInterceptor<T>(
    response: AxiosResponse<ApiResponse<T>>,
  ): T {
    const apiResponse = response.data;
    if (apiResponse.success && apiResponse.data !== undefined) {
      return apiResponse.data;
    }
    throw new Error(
      apiResponse.message || 'API returned success:false without a message.',
    );
  }

  private responseErrorInterceptor(error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      this.logger.error('Axios error occurred', {
        message: axiosError.message,
        url: axiosError.config?.url,
        code: axiosError.code,
        response: axiosError.response?.data?.message || axiosError.response?.data,
      });
    } else if (error instanceof Error) {
      this.logger.error('A standard error occurred in API call', error);
    } else {
      this.logger.error('An unexpected non-error was thrown in API call', {
        error,
      });
    }
    return Promise.reject(error);
  }

  public get<T>(url: string): Promise<T> {
    return this.client.get<ApiResponse<T>>(url) as unknown as Promise<T>;
  }

  public post<T>(url: string, data: unknown): Promise<T> {
    return this.client.post<ApiResponse<T>>(
      url,
      data,
    ) as unknown as Promise<T>;
  }
}