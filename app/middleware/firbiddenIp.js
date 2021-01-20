'use strict';

module.exports = (option) => {
  return async function firbiddenIp(ctx, next) {

    // firbiddenIps 数据可以来自数据库，也可以来自传参
    let firbiddenIps = option.firbiddenIps,
      clientIp = ctx.request.ip;

    if (firbiddenIps.indexOf(clientIp) !== -1) {
      ctx.status = 403;
      ctx.body = {'code': 403, 'msg': '您的ip已被屏蔽', 'data': null,};
    } else {
      await next();
    }
  };
};
