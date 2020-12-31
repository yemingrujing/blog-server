'use strict';

const whiteList = ['/api/user/login', '/api/user/userInfo', '/api/user/logout', '/api/user/captcha', '/api/user/theme',];

module.exports = () => {
  return async function auth(ctx, next) {
    const url = ctx.originalUrl,
      web = /^\/web\//;
    ctx.logger.info('url：' + url);
    if (whiteList.includes(url) || web.test(url)) {
      await next();
    } else if (ctx.session.username) {
      if (ctx.session.permission.includes(url)) {
        await next();
      } else {
        ctx.body = {'code': 500, 'msg': '暂无权限执行此操作', 'data': null,};
      }
    } else {
      ctx.throw(401, '您需要先登陆以后才能操作');
    }
  };
};
