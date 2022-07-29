import FeatureOnDemanCompilePage from './on-demand-compile-page/index.js';
import FeatureHTMLRender from './html-render/index.js';
import FeatureCustomServer from './custom-server/index.js';
import FeatureModel from './model/index.js';
import FilesystemRoutes from './filesystem-routes/index.js';

export { buildHtml } from './main/buildHtml.js';

export {
  getMiddlewares,
  getMiddlewaresBeforeDevMiddlewares
} from './middlewares.js';

export { getPlugin as getMainPlugin } from './main/index.js';

export const featurePlugins = [
  FeatureOnDemanCompilePage,
  FilesystemRoutes,
  FeatureHTMLRender,
  FeatureCustomServer,
  FeatureModel
];
