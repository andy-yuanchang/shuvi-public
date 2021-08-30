import AppComponent from '@shuvi/app/core/app';
import routes from '@shuvi/app/core/routes';
import { getRoutes } from '@shuvi/app/core/platform';
import initPlugins from '@shuvi/app/user/plugin';
import { pluginRecord } from '@shuvi/app/core/plugins';
import { Application } from './application';
import runPlugins from './runPlugins';
import { createRouter } from '@shuvi/router';
import createHistory from '@shuvi/app/core/client/history';
import { History } from '@shuvi/router/lib/types';
import { Runtime, IApplication } from '@shuvi/types';
declare let __SHUVI: any;
let app: IApplication;
let history: History;
let appContext: Runtime.IApplicationCreaterContext;
export const create: Runtime.ApplicationCreater = function (context, options) {
  appContext = context;
  // app is a singleton in client side
  if (app) {
    return app;
  }
  history = createHistory();
  const router = createRouter({
    history,
    routes: getRoutes(routes, context)
  });
  app = new Application({
    AppComponent,
    router,
    context,
    render: options.render
  });

  runPlugins({
    tap: app.tap.bind(app),
    initPlugins,
    pluginRecord
  });

  return app;
};

if (module.hot) {
  module.hot.accept(
    [
      '@shuvi/app/entry.client',
      '@shuvi/app/core/app',
      '@shuvi/app/core/routes',
      '@shuvi/app/user/plugin'
    ],
    async () => {
      const rerender = () => {
        const AppComponent = require('@shuvi/app/core/app').default;
        const routes = require('@shuvi/app/core/routes').default;
        const router = createRouter({
          history,
          routes: getRoutes(routes, appContext)
        });
        app.rerender({ router, AppComponent });
      };
      // to solve routing problem, we need to rerender routes
      // wait navigation complete only rerender to ensure getInitialProps is called
      if (__SHUVI.router._pending) {
        const removelistener = __SHUVI.router.afterEach(() => {
          rerender();
          removelistener();
        });
      } else {
        rerender();
      }
    }
  );
}