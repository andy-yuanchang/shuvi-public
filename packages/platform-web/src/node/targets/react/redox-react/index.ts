import * as path from 'path';
import { createPlugin } from '@shuvi/service';
import { resolveLib, resolvePkgFile } from '../../../paths.js';
import { require } from '../../../paths.js';

// todo: optimize this
const runtimePath = resolvePkgFile('esm/shuvi-app/react/redox-react/runtime');
const core = createPlugin({
  addRuntimeService: () => [
    {
      source: path.dirname(require.resolve('@shuvi/redox-react/package.json')),
      exported: '*',
      filepath: 'model.ts'
    }
  ],
  configWebpack: config => {
    config.resolve.alias.set('@shuvi/redox', resolveLib('@shuvi/redox'));
    return config;
  }
});
export const RedoxReactPlugin = {
  core,
  runtime: {
    plugin: runtimePath
  }
};
