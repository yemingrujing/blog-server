'use strict';

const moment = require('moment');
const uuidV1 = require('uuid/v1');
const crypto = require('crypto');

module.exports = {

  /**
   * 获取当前时间
   * @param format
   * @param t
   * @return {*}
   */
  getNowTime(format = 'YYYY-MM-DD HH:mm:ss', t) {
    const time = t ? new Date(t) : new Date();
    return moment(time)
      .format(format);
  },

  /**
   * UUID生成
   * @return {*}
   */
  getUUID() {
    return uuidV1()
      .replace(/-/g, '');
  },

  /**
   * MD5加密
   * @param str
   * @return {Promise<ArrayBuffer>|null}
   */
  md5Encode(str) {
    if (str) {
      const md5Str = crypto.createHash('md5')
        .update(str)
        .digest('hex');
      return md5Str;
    }
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
      'errMsg': res.msg,
      'data': res.data,
    };
  },

  /**
   * 数组去重
   * @param array
   * @return {[]}
   */
  uniq(array){
    let temp = {},
      r = [],
      len = array.length,
      val,
      type;
    for (let i = 0; i < len; i++) {
      val = array[i];
      type = typeof val;
      if (!temp[val]) {
        temp[val] = [type,];
        r.push(val);
      } else if (temp[val].indexOf(type) < 0) {
        temp[val].push(type);
        r.push(val);
      }
    }
    return r;
  },

  cover() {
    const i = parseInt(Math.random() * 31, 10);
    return 'image-base-url/blog/cover/' + i + '.jpg';
  },
};
