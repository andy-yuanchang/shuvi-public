import '@shuvi/platform-shared/shuvi-type-extensions-node';
import { IManifest } from '@shuvi/toolpack/lib/webpack/types.js';
import {
  IMiddlewareRoutes,
  CreateAppServer,
  IApiRoutes,
  IServerModule,
  PlatformWebCustomConfig
} from '../shared/index.js';
import { IViewServer } from './features/html-render/index.js';
import {
  addRoutes,
  addMiddlewareRoutes
} from './features/filesystem-routes/hooks.js';
import { extendedHooks } from './features/html-render/serverHooks.js';
export {};

declare module '@shuvi/service/resources' {
  export const server: {
    server: IServerModule;
    apiRoutes: IApiRoutes;
    middlewareRoutes: IMiddlewareRoutes;
    application: {
      createApp: CreateAppServer;
    };
    view: IViewServer;
  };
  export const documentPath: string;
  export const clientManifest: IManifest;
  export const serverManifest: IManifest;
}

declare global {
  namespace ShuviService {
    interface CustomConfig {
      ssr: PlatformWebCustomConfig['ssr'];
      router: PlatformWebCustomConfig['router'];
      routes?: PlatformWebCustomConfig['routes'];
      middlewareRoutes?: PlatformWebCustomConfig['middlewareRoutes'];
      apiRoutes?: PlatformWebCustomConfig['apiRoutes'];
      conventionRoutes: PlatformWebCustomConfig['conventionRoutes'];
    }
    interface CustomCorePluginHooks {
      addRoutes: typeof addRoutes;
      addMiddlewareRoutes: typeof addMiddlewareRoutes;
      // addAPIRoutes: typeof addAPIRoutes;
    }
    interface CustomServerPluginHooks {
      getPageData: typeof extendedHooks.getPageData;
      handlePageRequest: typeof extendedHooks.handlePageRequest;
      modifyHtml: typeof extendedHooks.modifyHtml;
    }
  }
}
