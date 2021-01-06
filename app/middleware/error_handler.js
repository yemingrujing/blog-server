'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      let status = !err.status ? 500 : err.status,
        error;
      if (status === 500) {
        if (ctx.app.config.env === 'prod') {
          error = 'Internal Server Error';
        } else {
          status = err[0];
          error = err[1];
        }
      } else {
        error = err.message;
      }
      status = !isNaN(Number(status)) ? status : 500;
      ctx.status = status;
      ctx.helper.fail(ctx, {'code': status, 'msg': !error ? err.name : error, 'data': [],});
    }
  };
};
