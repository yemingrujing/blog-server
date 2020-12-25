'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');

class ToolsService extends Service {

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

  time(format = 'yyyy-MM-dd hh:mm:ss', t) {
    const time = t ? new Date(t) : new Date(),
      o = {
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
        'q+': Math.floor((time.getMonth() + 3) / 3),
        'S': time.getMilliseconds(),
      };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (String(time.getFullYear())).substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((String(o[k])).length)));
      }
    }
    return format;
  }
}

module.exports = ToolsService;
