import { IServerModule as _IServerModule } from '../shared/index.js';

type ServerModule = Required<_IServerModule>;

export type GetPageDataFunction = ServerModule['getPageData'];

export type HandlePageRequestFunction = ServerModule['handlePageRequest'];

export type ModifyHtmlFunction = ServerModule['modifyHtml'];
