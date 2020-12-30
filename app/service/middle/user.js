'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async login(username, password) {
    const {ctx,} = this,
      count = await ctx.model.User.count({
        'where': {
          'userName': username,
          'userPassword': ctx.helper.md5Encode(password),
          'status': 0,
        },
      });
    if (count > 0) {
      return true;
    }
    return false;
  }

  async queryUserInfo(username) {
    const {ctx,} = this,
      userInfo = await ctx.model.User.findAll({
        'attributes': ['id', 'userName', 'nickName', 'roleId', 'avatar', 'theme',],
        'where': {username, 'status': 0,},
      });
    if (!userInfo) {
      ctx.throw(500, [999, '用户信息不存在',]);
    }
    ctx.session.role = userInfo.roleId;
    ctx.session.username = username;
    ctx.session.captcha = '';
    return userInfo;
  }
}

module.exports = UserService;
