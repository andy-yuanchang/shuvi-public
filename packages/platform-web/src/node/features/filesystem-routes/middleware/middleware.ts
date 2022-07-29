import { IServerPluginContext, IRequestHandlerWithNext } from '@shuvi/service';
import { matchPathname } from '@shuvi/router';
import resources from '@shuvi/service/resources';
const { server } = resources;

export function middleware(
  _api: IServerPluginContext
): IRequestHandlerWithNext {
  return async function (req, res, next) {
    const { middlewareRoutes = [] } = server;
    // match path for get middlewares
    let middlewares: IRequestHandlerWithNext[] = [];

    for (let i = 0; i < middlewareRoutes.length; i++) {
      const middlewareRoute = middlewareRoutes[i];
      const match = matchPathname(middlewareRoute.path, req.pathname);
      if (match) {
        req.params = match.params;
        middlewares.push(middlewareRoutes[i].middleware.default);
      }
    }

    // run middlewares
    let i = 0;
    const runNext = () => runMiddleware(middlewares[++i]);

    const runMiddleware = async (middleware: IRequestHandlerWithNext) => {
      if (i === middlewares.length) {
        return next();
      }

      await middleware(req, res, runNext);
    };

    return await runMiddleware(middlewares[i]);
  };
}
