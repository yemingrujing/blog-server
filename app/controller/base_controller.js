'use strict';

const {Controller,} = require('egg');

class BaseController extends Controller {
  success(result, type) {
    this.ctx.helper.success(this.ctx, type + '成功', result);
  }

  error(msg, data) {
    this.ctx.helper.fail(this.ctx, {'code': 500, 'msg': msg || 'error', data,});
  }

  notFound(msg) {
    this.ctx.throw(404, msg || 'not found');
  }
}

module.exports = BaseController;
