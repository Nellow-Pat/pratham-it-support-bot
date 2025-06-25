import { DependencyContainer } from 'tsyringe';
import { DynamicViewService } from './implementations/DynamicViewService';
import { IDynamicViewService } from './interfaces/IDynamicViewService';

export function registerDynamicViewsModule(container: DependencyContainer): void {
  container.register(IDynamicViewService, { useClass: DynamicViewService });
}