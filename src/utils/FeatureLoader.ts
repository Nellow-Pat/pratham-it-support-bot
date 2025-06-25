import { promises as fs } from 'fs';
import path from 'path';
import { DependencyContainer } from 'tsyringe';
import { IFeatureModule } from '@/core/interfaces/IFeatureModule';
import { LoggerService } from './logger';
import { toError } from './ErrorUtils';

export async function loadFeatures(
  container: DependencyContainer,
): Promise<Map<string, IFeatureModule>> {
  const logger = container.resolve(LoggerService);
  const featuresMap = new Map<string, IFeatureModule>();

  const isProduction = __filename.endsWith('.js');
  const fileExtension = isProduction ? '.js' : '.ts';
  const featuresDir = path.join(__dirname, '..', 'features');
  
  logger.info(`Loading features from: ${featuresDir}. Mode: ${isProduction ? 'Production' : 'Development'}`);

  try {
    const featureDirs = await fs.readdir(featuresDir, { withFileTypes: true });

    for (const dirent of featureDirs) {
      if (dirent.isDirectory()) {
        const modulePath = path.join(featuresDir, dirent.name, `module${fileExtension}`);
        
        try {
          await fs.stat(modulePath);

          const moduleImport = await import(modulePath);
          const FeatureModuleClass = moduleImport.default;

          if (FeatureModuleClass && typeof FeatureModuleClass === 'function') {
            const featureModule = new FeatureModuleClass() as IFeatureModule;
            if (featureModule && typeof featureModule.register === 'function' && featureModule.name) {
              featuresMap.set(featureModule.name, featureModule);
              logger.info(`Successfully loaded feature module: ${featureModule.name}`);
            }
          }
        } catch (e) {
            const error = toError(e);
            if (!error.message.includes('ENOENT')) {
               logger.warn(`Could not load module from ${dirent.name}. Error: ${error.message}. Skipping.`);
            }
        }
      }
    }
  } catch (e) {
    const error = toError(e);
    logger.error(`Failed to read features directory at ${featuresDir}.`, error);
  }

  return featuresMap;
}