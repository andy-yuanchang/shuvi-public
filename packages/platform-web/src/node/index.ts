import { IPlatform } from '@shuvi/service';
import {
  SharedPlugins,
  getPresetRuntimeFilesCreator
} from '@shuvi/platform-shared/node';
import {
  featurePlugins,
  getMiddlewares,
  getMiddlewaresBeforeDevMiddlewares,
  getMainPlugin
} from './features/index.js';
import { resolvePkgFile } from './paths.js';

export { PlatformWebCustomConfig } from '../shared/configTypes.js';

const platform =
  ({ framework = 'react' } = {}): IPlatform =>
  async platformContext => {
    const mainPlugin = getMainPlugin(platformContext);

    const platformFramework = (await import(`./targets/${framework}/index.js`))
      .default;
    const platformFrameworkContent = await platformFramework();

    const platformModule = platformFrameworkContent.platformModule as string;
    const polyfills = platformFrameworkContent.polyfills as string[];

    const getPresetRuntimeFiles = getPresetRuntimeFilesCreator(
      platformModule,
      polyfills
    );

    return {
      types: [
        resolvePkgFile('shuvi-env.d.ts'),
        resolvePkgFile('shuvi-image.d.ts')
      ],
      plugins: [
        ...SharedPlugins,
        mainPlugin,
        ...featurePlugins,
        ...platformFrameworkContent.plugins
      ],
      getPresetRuntimeFiles,
      getMiddlewares,
      getMiddlewaresBeforeDevMiddlewares
    };
  };

export default platform;
