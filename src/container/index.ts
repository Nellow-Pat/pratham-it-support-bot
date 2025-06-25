import { container, DependencyContainer } from 'tsyringe';
import { Config } from '@/config';
import { LoggerService } from '@/utils/logger';
import { Orchestrator } from '@/Orchestrator';
import { registerApiModule } from '@/shared/api/module';
import { registerServerModule } from '@/shared/server/module';
import { registerDynamicViewsModule } from '@/shared/dynamic-views/module';

const appConfig = new Config();

container.register<Config>(Config, { useValue: appConfig });
container.registerSingleton(LoggerService);
container.register<DependencyContainer>('MainContainer', { useValue: container });

registerApiModule(container);
registerServerModule(container);
registerDynamicViewsModule(container); 

container.registerSingleton(Orchestrator);

export { container };