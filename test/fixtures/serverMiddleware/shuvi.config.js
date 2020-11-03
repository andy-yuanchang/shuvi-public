module.exports = {
  ssr: true,
  serverMiddleware: [
    'koa-lowercase',
    'api/set-header',
    { path: '/health-check', handler: 'api/health-check' },
    { path: '/health-check2', handler: 'api/health-check' },
    { path: '/users/:id', handler: 'api/user' },
    { path: '/profile/:id/setting*', handler: 'api/setting' },
  ]
};