import { existsSync } from 'fs';
import path from 'path';
import { CommanderStatic } from 'commander';
import { UserConfig, IPlatform } from '@shuvi/service';
import {
  loadConfig,
  mergeConfig,
  getFullUserConfig
} from '@shuvi/service/lib/core/config';
//@ts-ignore
import pkgInfo from '../package.json';

export function getPackageInfo() {
  return pkgInfo;
}

export function getProjectDir(
  cmd: CommanderStatic | Record<string, any>
): string {
  const dir = path.resolve(cmd.args[0] || '.');
  if (!existsSync(dir)) {
    console.error(`> No such directory exists as the project root: ${dir}`);
    cmd.outputHelp();
    process.exit(1);
  }
  return dir;
}

function set(obj: any, path: string, value: any) {
  const segments = path.split('.');
  const final = segments.pop()!;
  for (var i = 0; i < segments.length; i++) {
    if (!obj) {
      return;
    }
    obj = obj[segments[i]];
  }
  obj[final] = value;
}

export type OptionsKeyMap = Record<
  string,
  string | ((config: any, optionValue: any) => void)
>;

export async function getConfigFromCli(
  cwd: string,
  cliOptions: Record<string, any>,
  cliOptionsKeyMap: OptionsKeyMap = {}
): Promise<Required<UserConfig>> {
  const configFilePath =
    cliOptions.config && path.resolve(cwd, cliOptions.config);
  const configFromFile = await loadConfig({
    rootDir: cwd,
    filepath: configFilePath
  });
  const configFromCliOtherOptions = getConfigFromCliOtherOptions(
    cliOptions,
    cliOptionsKeyMap
  );
  const configFromCli = mergeConfig(configFromFile, configFromCliOtherOptions);
  return getFullUserConfig(configFromCli);
}

export function getConfigFromCliOtherOptions(
  cliOptions: Record<string, any>,
  cliOptionsKeyMap: OptionsKeyMap = {}
): UserConfig {
  const config = {};
  Object.keys(cliOptionsKeyMap).forEach(key => {
    if (typeof cliOptions[key] !== 'undefined') {
      const mappedKeyOrFunction = cliOptionsKeyMap[key];
      const cliOptionValue = cliOptions[key];
      if (typeof mappedKeyOrFunction === 'function') {
        mappedKeyOrFunction(config, cliOptionValue);
      } else {
        set(config, mappedKeyOrFunction, cliOptionValue);
      }
    }
  });
  try {
    const { configOverrides } = cliOptions;
    if (configOverrides) {
      const overrides = JSON.parse(configOverrides);
      Object.assign(config, overrides);
    }
  } catch (err) {
    console.error(err);
  }
  return config;
}

export function getPlatform(platform: string = 'web'): IPlatform {
  const platformName = `@shuvi/platform-${platform}`;
  const platformInstance: IPlatform = require(platformName).default;
  return platformInstance;
}
