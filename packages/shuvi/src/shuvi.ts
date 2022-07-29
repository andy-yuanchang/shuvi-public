import { IPlatform, getApi, Api } from '@shuvi/service';
import { ShuviMode, ShuviPhase } from './types';
import { ShuviConfig, normalizeConfig } from './config';

export async function getPlatform(): Promise<IPlatform> {
  const platformWeb = await import('@shuvi/platform-web');
  //@ts-ignore
  return platformWeb.default({ framework: 'react' });
}

export interface ShuviOption {
  cwd?: string;
  phase?: ShuviPhase;
  mode?: ShuviMode;
  config: ShuviConfig;
}

export async function initShuvi({
  config,
  ...options
}: ShuviOption): Promise<Api> {
  const normalizedConfig = normalizeConfig(config);
  const { plugins, presets, ...restConfig } = normalizedConfig;
  const platform = await getPlatform();
  const shuvi = await getApi({
    ...options,
    plugins,
    presets,
    config: restConfig,
    platform
  });

  return shuvi;
}
