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
};
