import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { File } from "../models/files";

export interface Paths {
  projectDir: string;
  buildDir: string;

  // user src dir
  srcDir: string;

  // dir to store shuvi generated src files
  appDir: string;

  pagesDir: string;
  // pageDocument: string;
}

export interface RouteConfig {
  id: string;
  path?: string | string[];
  exact?: boolean;
  routes?: RouteConfig[];
  component?: any;
  componentFile: string;
  [x: string]: any;
}

export interface MatchedRoute<
  Params extends { [K in keyof Params]?: string } = {}
> {
  route: RouteConfig;
  match: {
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
  };
}

export interface AppConfig {
  ssr: boolean;
  cwd: string;
  outputPath: string;
  publicUrl: string;
  router: {
    history: 'browser' | 'hash'
  }
}

export interface BuildOptions {}

export interface RouteComponentContext {
  isServer: boolean;
  pathname: string;
  query: ParsedUrlQuery;
  params: ParsedUrlQuery;
  req?: { url: string };
  // res?: ServerResponse;
}

export type RouteComponent<T, P = {}> = T & {
  getInitialProps?(context: RouteComponentContext): P | Promise<P>;
};

export interface AppCore {
  config: AppConfig;
  paths: Paths;

  setBootstrapModule(module: string): void;

  setAppModule(lookups: string[], fallback: string): void;

  setDocumentModule(lookups: string[], fallback: string): void;

  setRoutesSource(content: string): void;

  addFile(file: File): void;
  // waitUntilBuild(): Promise<void>;

  build(options: BuildOptions): Promise<void>;

  buildOnce(options: BuildOptions): Promise<void>;
}