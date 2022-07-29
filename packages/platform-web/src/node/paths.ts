import path from 'path';
import { createRequire } from 'node:module';
export const require = createRequire(import.meta.url);

export const dirname = (metaUrl: string) =>
  path.dirname(new URL(metaUrl).pathname);

const PACKAGE_DIR = path.resolve(dirname(import.meta.url), '..', '..');

// export const resolveToModulePath = (...paths: string[]) =>
//   `@shuvi/platform-web/${paths.join('/')}`;

export const resolveDep = (module: string) => require.resolve(module);

export const resolveLib = (module: string) =>
  path.dirname(resolveDep(path.join(module, 'package.json')));

export const resolvePkgFile = (...paths: string[]) =>
  path.join(PACKAGE_DIR, ...paths);
