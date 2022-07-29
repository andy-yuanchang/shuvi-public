import path from 'path';

export const dirname = (metaUrl: string) =>
  path.dirname(new URL(metaUrl).pathname);

export const PackageDir = path.resolve(dirname(import.meta.url), '..', '..');

export const resolvePluginFile = (pluginName: string, ...paths: string[]) =>
  path.join(
    PackageDir,
    'esm',
    'node',
    'platform',
    'plugins',
    pluginName,
    ...paths
  );

export const resolvePkgFile = (...paths: string[]) =>
  path.join(PackageDir, ...paths);
