'use strict';

const whiteList = ['/api/user/login', '/api/user/userInfo', '/api/user/logout', '/api/user/captcha', '/api/user/theme',],
  authWhiteList = ['/api/user/login', '/api/user/captcha',];

module.exports = () => {
  return async function auth(ctx, next) {
    const url = ctx.originalUrl,
      web = /^\/web\//;
    let username = '',
      token = ctx.request.header.authorization;
    if (!authWhiteList.includes(url)) {
      if (!token) {
        ctx.throw(401, '您需要先登陆以后才能操作');
      }
      token = token.replace('Bearer ', '');

      ctx.logger.info('token：' + token);

      // 验证当前token
      ctx.app.jwt.verify(token, ctx.app.config.jwt.secret, function (err, decode) {
        if (err) {
          ctx.throw(401, 'Token已过期');
        }
        if (!decode || !decode.username) {
          ctx.throw(401, '没有权限，请登录');
        }
        username = decode.username;
      });
    }

    if (whiteList.includes(url) || web.test(url)) {
      await next();
    } else if (ctx.session.username) {
      if (username !== ctx.session.username) {
        ctx.throw(401, '您需要先登陆以后才能操作');
      }
      ctx.logger.info('permission：' + ctx.session.permission);
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
