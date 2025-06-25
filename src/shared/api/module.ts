import { DependencyContainer } from 'tsyringe';
import { ApiService } from './implementations/ApiService';
import { AuthService } from './implementations/AuthService';
import { IApiService } from './interfaces/IApiService';
import { IAuthService } from './interfaces/IAuthService';

export function registerApiModule(container: DependencyContainer): void {
  container.registerSingleton<IAuthService>(IAuthService, AuthService);
  container.registerSingleton<IApiService>(IApiService, ApiService);
}