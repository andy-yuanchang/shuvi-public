import * as path from 'path';
import { createPlugin } from '@shuvi/service';
import { resolvePkgFile, require } from '../../paths.js';
import server from './server.js';

const resolveLib = (module: string) =>
  path.dirname(require.resolve(path.join(module, 'package.json')));

const core = createPlugin({
  addRuntimeService: () => [
    {
      source: resolveLib('@shuvi/redox'),
      exported: '*',
      filepath: 'model.ts'
    }
  ],
  configWebpack: config => {
    config.resolve.alias.set('@shuvi/redox', resolveLib('@shuvi/redox'));
    return config;
  }
});

export default {
  core,
  runtime: {
    plugin: resolvePkgFile('esm/node/features/model/runtime.js')
  },
  server,
  types: resolvePkgFile('esm/node/features/model/shuvi-app.d.ts')
};
