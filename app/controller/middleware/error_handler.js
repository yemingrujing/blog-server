'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (error) {
      ctx.app.emit('error', error, ctx);
      const status = error.status || 500,
        err = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : error.message;
      ctx.body = {err,};
      if (status ===422) {
        ctx.body.detail = error.errors;
      }
      ctx.status = status;
    }
  };
};
