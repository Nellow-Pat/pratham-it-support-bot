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
  const featuresDir = path.join(__dirname, '../features');

  try {
    const featureDirs = await fs.readdir(featuresDir, { withFileTypes: true });

    for (const dirent of featureDirs) {
      if (dirent.isDirectory()) {
        const modulePath = path.join(featuresDir, dirent.name, 'module.js');
        try {
          if ((await fs.stat(modulePath))) {
            const moduleImport = await import(modulePath);
            const FeatureModuleClass = moduleImport.default;
            const featureModule = new FeatureModuleClass() as IFeatureModule;

            if (featureModule && typeof featureModule.register === 'function' && featureModule.name) {
              featuresMap.set(featureModule.name, featureModule);
              logger.info(`Successfully loaded feature module: ${featureModule.name}`);
            }
          }
        } catch (e) {
            const error = toError(e);
            logger.warn(`Could not load module from ${dirent.name}. Error: ${error.message}. Skipping.`);
        }
      }
    }
  } catch (e) {
    logger.error('Failed to read features directory.', toError(e));
  }

  return featuresMap;
}