'use strict';

const moment = require('moment');
const uuidV1 = require('uuid/v1');

module.exports = {
  getNowTime(format = 'YYYY-MM-DD HH:mm:ss', t) {
    const time = t ? new Date(t) : new Date();
    return moment(time).format(format);
  },
  getUUID() {
    return uuidV1().replace(/-/g, '');
  },
  md5Encode(str) {
    if (str) {
      const md5Str = crypto.createHash('md5').update(str).digest('hex');
      this.ctx.logger.info('2用户新增密码MD5加密：%j', md5Str);
      return md5Str;
    }
    this.ctx.logger.info('3用户新增密码MD5加密：%j', str);
    return null;
  },

  /**
   * 调用正常情况的返回数据封装
   * @param {Object} ctx - context
   * @param {*} msg  - message
   * @param {*} data - 数据
   */
  success(ctx, msg, data) {
    ctx.body = {
      'code': 200,
      msg,
      data,
    };
    ctx.status = 200;
  },

  /**
   * 处理失败，处理传入的失败原因
   * @param {*} ctx - context
   * @param {Object} res - 返回的状态数据
   */
  fail(ctx, res) {
    ctx.body = {
      'code': res.code,
      'msg': res.msg,
      'data': res.data,
    };
    ctx.status = 500;
  },
};
