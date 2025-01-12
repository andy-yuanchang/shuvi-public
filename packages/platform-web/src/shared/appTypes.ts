import {
  IRequest,
  IRawPageRouteRecord,
  IAppData,
  IAppState
} from '@shuvi/platform-shared/shared';
import { Application } from '@shuvi/platform-shared/shuvi-app/application';

export interface CreateAppServer {
  (options: { req: IRequest; ssr: boolean }): Application;
}

export interface CreateAppClient {
  (options: {
    routes: IRawPageRouteRecord[];
    appComponent: any;
    appData: IAppData<any, IAppState>;
  }): Application;
}
