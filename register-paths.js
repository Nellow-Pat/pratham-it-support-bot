const tsconfig = require('./tsconfig.json');
const tsconfigPaths = require('tsconfig-paths');

const outDir = tsconfig.compilerOptions.outDir || 'dist';

const runtimePaths = {};
for (const alias in tsconfig.compilerOptions.paths) {
  const paths = tsconfig.compilerOptions.paths[alias];
  runtimePaths[alias] = paths.map(p => p.replace('src/', ''));
}

tsconfigPaths.register({
  baseUrl: outDir,
  paths: runtimePaths,
});