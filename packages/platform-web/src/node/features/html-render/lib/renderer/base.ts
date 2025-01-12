import { IAppData, Response } from '@shuvi/platform-shared/shared';
import { htmlEscapeJsonString } from '@shuvi/utils/lib/htmlescape';
import {
  BUILD_CLIENT_RUNTIME_MAIN,
  BUILD_CLIENT_RUNTIME_POLYFILL,
  IServerPluginContext
} from '@shuvi/service';
import {
  CLIENT_CONTAINER_ID,
  DEV_STYLE_ANCHOR_ID,
  DEV_STYLE_HIDE_FOUC,
  CLIENT_APPDATA_ID
} from '@shuvi/shared/lib/constants';
import { clientManifest } from '@shuvi/service/lib/resources';
import generateFilesByRoutId from '../generateFilesByRoutId';
import { tag } from './htmlTag';
import { IHtmlDocument, IHtmlTag, IApplication } from './types';
import { IRendererConstructorOptions, IRenderDocumentOptions } from './types';

export type AppData = Omit<IAppData, 'filesByRoutId' | 'publicPath'>;

export abstract class BaseRenderer {
  protected _serverPluginContext: IServerPluginContext;
  protected _app?: IApplication;

  constructor({ serverPluginContext }: IRendererConstructorOptions) {
    this._serverPluginContext = serverPluginContext;
  }

  abstract renderDocument({
    app,
    req
  }: IRenderDocumentOptions):
    | Promise<IHtmlDocument | Response>
    | IHtmlDocument
    | Response;

  protected _getMainAssetTags(): {
    styles: IHtmlTag<any>[];
    scripts: IHtmlTag<any>[];
  } {
    const styles: IHtmlTag<'link' | 'style'>[] = [];
    const scripts: IHtmlTag<'script'>[] = [];
    const entrypoints = clientManifest.entries[BUILD_CLIENT_RUNTIME_MAIN];
    const polyfill = clientManifest.bundles[BUILD_CLIENT_RUNTIME_POLYFILL];

    scripts.push(
      tag('script', {
        src: this._serverPluginContext.getAssetPublicUrl(polyfill)
      })
    );
    entrypoints.js.forEach((asset: string) => {
      scripts.push(
        tag('script', {
          src: this._serverPluginContext.getAssetPublicUrl(asset)
        })
      );
    });
    if (entrypoints.css) {
      entrypoints.css.forEach((asset: string) => {
        styles.push(
          tag('link', {
            rel: 'stylesheet',
            href: this._serverPluginContext.getAssetPublicUrl(asset)
          })
        );
      });
    }
    if (this._serverPluginContext.mode === 'development') {
      styles.push(
        tag(
          'style',
          {
            [DEV_STYLE_HIDE_FOUC]: true
          },
          'body{display:none}'
        ),

        /**
         * this element is used to mount development styles so the
         * ordering matches production
         * (by default, style-loader injects at the bottom of <head />)
         */
        tag('style', {
          id: DEV_STYLE_ANCHOR_ID
        })
      );
    }

    return {
      styles,
      scripts
    };
  }

  protected _getAppContainerTag(html: string = ''): IHtmlTag<'div'> {
    return tag(
      'div',
      {
        id: CLIENT_CONTAINER_ID
      },
      html
    );
  }

  protected _getInlineAppData(app: IApplication, appData: AppData): IHtmlTag {
    const routes = app.router.routes || [];
    const data = JSON.stringify({
      ...appData,
      filesByRoutId: generateFilesByRoutId(clientManifest, routes),
      publicPath: this._serverPluginContext.getAssetPublicUrl()
    });
    return tag(
      'script',
      {
        id: CLIENT_APPDATA_ID,
        type: 'application/json'
      },
      htmlEscapeJsonString(data)
    );
  }
}
