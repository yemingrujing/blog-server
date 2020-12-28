'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.logger.info(`error报错信息：${err}`);
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500,
        error = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : error.message;
      ctx.body = {
        'msg': error,
        'code': status,
        'data': [],
        'detail': status === 422 ? err.errors : '',
      };
    }
  };
};
