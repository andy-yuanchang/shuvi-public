import path from 'path';
import { IConfig, IApiConfig } from '../api';
import { PUBLIC_PATH, CONFIG_FILE } from '../constants';
import { loadDotenvConfig } from './loadDotenvConfig';
import { deepmerge } from '@shuvi/utils/lib/deepmerge';

export interface LoadConfigOptions {
  rootDir?: string;
  configFile?: string;
  overrides?: IConfig;
}

export const createDefaultConfig: () => IApiConfig = () => ({
  ssr: true,
  env: {},
  rootDir: process.cwd(),
  outputPath: 'dist',
  platform: {
    name: 'web',
    framework: 'react',
    target: 'ssr'
  },
  publicDir: 'public',
  publicPath: PUBLIC_PATH,
  router: {
    history: 'auto'
  },
  apiConfig: {
    prefix: '/api',
    bodyParser: true
  }
});

export function loadConfig({
  rootDir = '.',
  configFile = CONFIG_FILE,
  overrides = {}
}: LoadConfigOptions = {}): IConfig {
  rootDir = path.resolve(rootDir);
  configFile = path.resolve(rootDir, configFile);

  // read dotenv so we can get env in shuvi.config.js
  loadDotenvConfig(rootDir);

  let fileConfig: IConfig = {};
  try {
    fileConfig = require(configFile);
    fileConfig = (fileConfig as any).default || fileConfig;
  } catch (err) {
    if (
      (err as Error).message.indexOf(`Cannot find module '${configFile}'`) < 0
    ) {
      throw err;
    } else if (configFile !== path.resolve(rootDir, CONFIG_FILE)) {
      console.warn('Config file not found: ' + configFile);
    }
  }
  return deepmerge({ rootDir }, fileConfig, overrides);
}