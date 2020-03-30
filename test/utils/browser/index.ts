// License: https://github.com/nuxt/nuxt.js/blob/9831943a1f270069e05bbf1a472804b31ed4b007/LICENSE

// @ts-ignore
import puppeteer, {
  DirectNavigationOptions,
  ConsoleMessage
} from "puppeteer-core";

import ChromeDetector from "./chrome";

export interface Page extends puppeteer.Page {
  [x: string]: any;

  html(): Promise<string>;
  $text(selector: string, trim?: boolean): Promise<string>;
  $$text(selector: string, trim?: boolean): Promise<(string | null)[]>;
  $attr(selector: string, attr: string): Promise<string>;
  $$attr(selector: string, attr: string): Promise<(string | null)[]>;
  collectBrowserLog(): { texts: string[]; dispose: Function };

  shuvi: {
    navigate(path: string): Promise<any>;
  };
}

export interface PageOptions extends DirectNavigationOptions {
  disableJavaScript?: boolean;
}

export default class Browser {
  private _detector: any;
  private _browser!: puppeteer.Browser;

  constructor() {
    this._detector = new ChromeDetector();
  }

  async start(options: { baseURL?: string } = {}) {
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    const _opts = {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      ...options
    };

    if (!_opts.executablePath) {
      _opts.executablePath = this._detector.detect();
    }

    this._browser = await puppeteer.launch(_opts);
  }

  async close() {
    if (!this._browser) {
      return;
    }
    await this._browser.close();
  }

  async page(url?: string, options: PageOptions = {}): Promise<Page> {
    if (!this._browser) {
      throw new Error("Please call start() before page(url)");
    }
    const page = (await this._browser.newPage()) as Page;
    if (url) {
      if (options.disableJavaScript) {
        await page.setJavaScriptEnabled(false);
      }
      await page.goto(url, options);
    }
    // await page.waitForFunction(`!!${page.$nuxtGlobalHandle}`);

    page.collectBrowserLog = () => {
      const texts: string[] = [];
      const onLogs = (msg: ConsoleMessage) => {
        texts.push(msg.text());
      };
      page.on("console", onLogs);

      return {
        texts,
        dispose: () => {
          page.off("console", onLogs);
        }
      };
    };
    page.html = () =>
      page.evaluate(() => window.document.documentElement.outerHTML);
    page.$text = (selector: string, trim: boolean) =>
      page.$eval(
        selector,
        (el, trim) => {
          if (el.textContent === null) {
            throw Error("no matching element");
          }

          return trim
            ? el.textContent.replace(/^\s+|\s+$/g, "")
            : el.textContent;
        },
        trim
      );
    page.$$text = (selector: string, trim: boolean) =>
      page.$$eval(
        selector,
        (els, trim) =>
          els.map(el => {
            if (el.textContent === null) {
              return null;
            }

            return trim
              ? el.textContent.replace(/^\s+|\s+$/g, "")
              : el.textContent;
          }),
        trim
      );
    page.$attr = (selector: string, attr: string) =>
      page.$eval(
        selector,
        (el, attr) => {
          const val = el.getAttribute(attr);
          if (val === null) {
            throw Error(`"${el.tagName}" no attr "${attr}"`);
          }
          return val;
        },
        attr
      );
    page.$$attr = (selector: string, attr: string) =>
      page.$$eval(
        selector,
        (els, attr) => els.map(el => el.getAttribute(attr)),
        attr
      );

    const getShuvi = () => page.evaluateHandle("window.__SHUVI");
    page.shuvi = {
      async navigate(path: string) {
        const $shuvi = await getShuvi();
        return page.evaluate(
          ($shuvi, path: string) => $shuvi.router.push(path),
          $shuvi,
          path
        );
      }
    };
    return page;
  }
}