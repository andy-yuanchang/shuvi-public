import { createPlugin } from '@shuvi/service';
import { escapeRegExp } from '@shuvi/utils/lib/escapeRegExp.js';
import ModuleReplacePlugin from '@shuvi/toolpack/lib/webpack/plugins/module-replace-plugin/index.js';
import RequireCacheHotReloaderPlugin from '@shuvi/toolpack/lib/webpack/plugins/require-cache-hot-reloader-plugin.js';
import { ROUTE_RESOURCE_QUERYSTRING } from '@shuvi/shared/lib/constants.js';
import { resolvePkgFile } from '../../paths.js';

export default createPlugin({
  configWebpack(config, _, ctx) {
    if (ctx.mode === 'development') {
      config
        .plugin('private/module-replace-plugin')
        .use(ModuleReplacePlugin.default, [
          {
            modules: [
              {
                resourceQuery: RegExp(
                  escapeRegExp(`?${ROUTE_RESOURCE_QUERYSTRING}`)
                ),
                module: resolvePkgFile(
                  'esm/node/features/on-demand-compile-page/emptyComponent'
                )
              }
            ]
          }
        ]);
      // Even though require.cache is server only we have to clear assets from both compilations
      // This is because the client compilation generates the build manifest that's used on the server side
      config
        .plugin('private/require-cache-hot-reloader')
        .use(RequireCacheHotReloaderPlugin.default);
    }

    return config;
  }
});

export { default as OnDemandRouteManager } from './onDemandRouteManager.js';
