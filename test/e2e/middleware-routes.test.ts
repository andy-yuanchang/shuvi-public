import got from 'got';
import { AppCtx, launchFixture } from '../utils/index';

let ctx: AppCtx;

jest.setTimeout(5 * 60 * 1000);

describe('middleware-routes development', () => {
  beforeAll(async () => {
    ctx = await launchFixture('middleware-routes');
  });
  afterAll(async () => {
    await ctx.close();
  });

  test('should work', async () => {
    let res;

    res = await got.get(ctx.url('/health-check'));
    expect(res.body).toBe('200 OK');
    expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    expect(res.headers).toHaveProperty('set-cookie', [
      'shuvi-middleware-custom-cookie=foo; path=/; httponly'
    ]);

    // with querystring
    res = await got.get(ctx.url('/health-check?test=123'));
    expect(res.body).toBe('200 OK');
    expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    expect(res.headers).toHaveProperty('set-cookie', [
      'shuvi-middleware-custom-cookie=foo; path=/; httponly'
    ]);

    res = await got.get(ctx.url('/health-check2'));
    expect(res.body).toBe('200 OK');
    expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    expect(res.headers).toHaveProperty('set-cookie', [
      'shuvi-middleware-custom-cookie=foo; path=/; httponly'
    ]);

    res = await got.get(ctx.url('/health-check3'));
    expect(res.body).toBe('200 OK');
    expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    expect(res.headers).toHaveProperty('set-cookie', [
      'shuvi-middleware-custom-cookie=foo; path=/; httponly'
    ]);

    res = await got.get(ctx.url('/home'));
    expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    expect(res.headers).not.toHaveProperty('set-cookie');

    // Note: koa-lowercase /HOME -> 301 redirect /home
    // res = await got.get(ctx.url('/HOME'));
    // expect(res.url).toContain('/home');
    // expect(res.headers).toHaveProperty('shuvi-middleware-custom-header', 'bar');
    // expect(res.headers).not.toHaveProperty('set-cookie');
  });

  test('should match path /users/:id', async () => {
    let page;

    page = await ctx.browser.page(ctx.url('/home'));

    await page.goto(ctx.url('/users'));
    expect(await page.$text('body')).toMatch(/404/);

    await page.goto(ctx.url('/users/'));
    expect(await page.$text('body')).toMatch(/404/);

    await page.goto(ctx.url('/users/bob'));
    expect(await page.$text('body')).toMatch(/bob/);

    await page.goto(ctx.url('/users/bob/'));
    expect(await page.$text('body')).toMatch(/bob/);

    await page.goto(ctx.url('/users/bob/path'));
    expect(await page.$text('body')).toMatch(/bob/);

    await page.close();
  });

  test('should match path /profile/:id/setting:other(.*)', async () => {
    let page;
    let res;

    page = await ctx.browser.page(ctx.url('/home'));

    await page.goto(ctx.url('/profile'));
    expect(await page.$text('body')).toMatch(/404/);

    await page.goto(ctx.url('/profile/foo'));
    expect(await page.$text('body')).toMatch(/404/);

    await page.goto(ctx.url('/profile/foo/'));
    expect(await page.$text('body')).toMatch(/404/);

    res = await got.get(ctx.url('/profile/foo/setting'), {
      responseType: 'json'
    });
    expect(res.body).toStrictEqual({ id: 'foo', other: '' });

    res = await got.get(ctx.url('/profile/foo/setting/bank'), {
      responseType: 'json'
    });
    expect(res.body).toStrictEqual({ id: 'foo', other: '/bank' });

    await page.close();
  });

  test('assets should have a high priority', async () => {
    const res = await got.get(ctx.url(`/user.json`), {
      responseType: 'json'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'foo');
    expect(res.headers).not.toHaveProperty('shuvi-middleware-custom-header');
  });

  test('should allow plugin middleware', async () => {
    const page = await ctx.browser.page(ctx.url('/pluginServerMiddleware'));
    expect(await page.$text('body')).toBe('pluginServerMiddleware');
    await page.close();
  });

  test('should follow plugin middleware be added order', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const page = await ctx.browser.page(ctx.url('/testorder'));
    const consoleResult = consoleSpy.mock.calls.join('');
    expect(consoleResult).toBe(
      ['plugin 1', 'plugin 2', 'user default order', '10', ''].join('\n')
    );
    await page.close();
  });
});
