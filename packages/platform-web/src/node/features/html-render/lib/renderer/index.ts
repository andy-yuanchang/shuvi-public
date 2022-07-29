import { IServerPluginContext } from '@shuvi/service';
import { stringifyTag, stringifyAttrs } from './htmlTag.js';
import { parseTemplateFile, renderTemplate } from '../viewTemplate.js';
import {
  IRendererConstructorOptions,
  IRenderDocumentOptions
} from './types.js';
import { BaseRenderer } from './base.js';
import { SpaRenderer } from './spa.js';
import { SsrRenderer } from './ssr.js';
import { IHtmlDocument } from './types.js';
import resources from '@shuvi/service/resources';
const { documentPath } = resources;

export * from './types.js';

export interface ITemplateData {
  [x: string]: any;
}

export class Renderer {
  private _documentTemplate: ReturnType<typeof parseTemplateFile>;
  private _serverPluginContext: IServerPluginContext;
  private _ssrRenderer: BaseRenderer;
  private _spaRenderer: BaseRenderer;

  constructor(options: IRendererConstructorOptions) {
    this._serverPluginContext = options.serverPluginContext;
    this._documentTemplate = parseTemplateFile(documentPath);
    this._ssrRenderer = new SsrRenderer(options);
    this._spaRenderer = new SpaRenderer(options);
  }

  renderDocument(options: IRenderDocumentOptions) {
    if (this._serverPluginContext.config.ssr) {
      return this._ssrRenderer.renderDocument(options);
    }

    return this._spaRenderer.renderDocument(options);
  }

  renderDocumentToString(
    document: IHtmlDocument,
    templateData: ITemplateData = {}
  ) {
    const htmlAttrs = stringifyAttrs(document.htmlAttrs);
    const head = document.headTags.map(tag => stringifyTag(tag)).join('');
    const main = document.mainTags.map(tag => stringifyTag(tag)).join('');
    const script = document.scriptTags.map(tag => stringifyTag(tag)).join('');

    return renderTemplate(this._documentTemplate, {
      htmlAttrs,
      head,
      main,
      script,
      ...templateData
    });
  }
}
