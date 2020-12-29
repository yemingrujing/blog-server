'use strict';

const {Controller,} = require('egg');

class BaseController extends Controller {
  success({result, type,}) {
    const res = {'code': '000', 'data': result,};
    if (type) {
      res.code = result ? '000' : '500';
      res.msg = res.msg = type + (res.code ? '成功' : '失败');
    }
    this.ctx.body = res;
  }

  error(msg, data) {
    this.ctx.body = {
      'msg': msg || 'error',
      'code': '500',
      data,
    };
  }

  notFound(msg) {
    this.ctx.throw('404', msg || 'not found');
  }
}

module.exports = BaseController;
