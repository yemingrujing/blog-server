'use strict';

const whiteList = ['/api/user/login', '/api/user/userInfo', '/api/user/logout', '/api/user/captcha', '/api/user/theme',];

module.exports = () => {
  return async function auth(ctx, next) {
    const url = ctx.originalUrl,
      web = /^\/web\//,
      token = ctx.request.header.authorization;

    ctx.logger.info('url：' + url);

    if (whiteList.includes(url) || web.test(url)) {
      await next();
    } else if (ctx.session.username) {
      if (!token) {
        ctx.throw(401, '您需要先登陆以后才能操作');
      }

      ctx.logger.info('token：' + token);
      ctx.logger.info('token：' + ctx.app.config.jwt.secret);

      // 验证当前token
      const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      if (!decode || !decode.userName) {
        ctx.throw(401, '没有权限，请登录');
      }
      if (Date.now() - decode.expire > 0) {
        ctx.throw(401, 'Token已过期');
      }
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
