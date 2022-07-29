import { createServerPlugin } from '@shuvi/service';
import resources from '@shuvi/service/resources';
const { server } = resources;

export default createServerPlugin({
  getPageData: (appContext, context) => {
    return server?.server?.getPageData?.(appContext, context) || {};
  },
  handlePageRequest: (originalHandlePageRequest, context) => {
    return (
      server?.server?.handlePageRequest?.(originalHandlePageRequest, context) ||
      originalHandlePageRequest
    );
  },
  modifyHtml: async (document, context, pluginContext) => {
    await server?.server?.modifyHtml?.(document, context, pluginContext);
  }
});
