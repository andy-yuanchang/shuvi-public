import { createPlugin } from '@shuvi/service';
import { resolvePkgFile } from '../../paths.js';
import server from './server.js';

export {
  getPageMiddleware,
  IHtmlDocument,
  ITemplateData,
  IViewServer,
  IViewClient
} from './lib/index.js';

const core = createPlugin({
  addRuntimeFile: ({ defineFile }, context) => {
    const {
      config: {
        router: { history }
      }
    } = context;
    const routerConfigFile = defineFile({
      name: 'routerConfig.js',
      content: () => {
        return `export const historyMode = "${history}";`;
      }
    });

    return [routerConfigFile];
  }
});

export default {
  core,
  server,
  types: resolvePkgFile('esm/node/features/html-render/shuvi-app.d.ts')
};
