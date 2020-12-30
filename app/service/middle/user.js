'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async login(username, password) {
    const {ctx,} = this,
      result = await ctx.model.User.findAll({
        'attributes': ['id', 'userName', 'nickName', 'roleId', 'avatar', 'theme',],
        'where': {'userName': username, 'userPassword': ctx.helper.md5Encode(password), 'status': 0,},
      }),
      userInfo = result[0];
    ctx.logger.info('result：' + userInfo);
    if (!userInfo) {
      ctx.throw(401, '用户名/密码错误');
    }
    ctx.session.role = userInfo.roleId;
    ctx.session.username = username;
    ctx.session.captcha = '';
    return userInfo;
  }
}

module.exports = UserService;
