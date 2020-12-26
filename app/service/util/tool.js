'use strict';

const Service = require('egg').Service;
const moment = require('moment');
const crypto = require('crypto');
const svgCaptcha = require('svg-captcha');

class ToolService extends Service {

  async captcha() {
    const captcha = svgCaptcha.create({
      'size': 4,
      'fontSize': 50,
      'width': 100,
      'height': 40,
      'ignoreChars': '0o1i',
      'color': true,
    });
    this.ctx.session.captcha = captcha.text.toLocaleLowerCase();
    return captcha;
  }

  // 入参校验
  async validator(rules) {
    const {ctx, app,} = this,
      errors = await app.validator.validator(rules, ctx.request.body);
    if (errors) {
      ctx.body = {
        'code': 0,
        'msg': errors,
      };
    }
  }

  async time(format = 'YYYY-MM-DD HH:mm:ss', t) {
    const time = t ? new Date(t) : new Date();
    return moment(time).format(format);
  }

  async toInt(str) {
    if (typeof str === 'number') {
      return str;
    }
    if (!str) {
      return str;
    }
    return parseInt(str, 10) || 0;
  }

  async md5Encode(str) {
    if (str) {
      const md5Str = crypto.createHash('md5').update(str).digest('hex');
      this.ctx.logger.info('2用户新增密码MD5加密：%j', md5Str);
      return md5Str;
    }
    this.ctx.logger.info('3用户新增密码MD5加密：%j', str);
    return null;
  }
}

module.exports = ToolService;
