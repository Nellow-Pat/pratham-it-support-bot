import { DependencyContainer } from 'tsyringe';
import { ApiService } from '../services/ApiService';

export function registerApiServices(container: DependencyContainer): void {
  container.registerSingleton(ApiService);
}