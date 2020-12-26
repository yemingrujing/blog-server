'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async search(param, limit = 0, offset = 0 ) {
    const {ctx,} = this;
    return await ctx.model.User.findAndCountAll({
      'offset': offset,
      'limit': limit,
      'attributes':['id', 'userName', 'avatar', 'status', 'nickName', 'roleId','updateTime', 'remark',],
      'where': param,
      'order': [['userRegistTime','desc',],],
    });
  }

  async add(req) {
    const {ctx,} = this;
    ctx.logger.info('Service用户新增参数：%j', req.param);
    const {userIp, userName, roleId, userEmail, userTelephoneNumber, nickName,} = req.param;
    this.ctx.logger.info('1用户新增参数：%j', req.param);
    let userRegistTime = await this.service.util.tool.time();
    this.ctx.logger.info('1用户新增时间：%j', userRegistTime);
    let updateTime = await this.service.util.tool.time(),
      theme = req.param.theme || '#304156',
      avatar = req.param.avatar || 'https://raw.githubusercontent.com/SpectreAlan/images/master/blog/logo.png',
      status = 0,
      userPassword = await this.service.util.tool.md5Encode(req.param.userPassword),
      user = await ctx.model.User.create({userIp, userName, userPassword, roleId, userEmail, avatar, userRegistTime, userTelephoneNumber, nickName, theme, status, updateTime,});
    if (user) {
      return user.id;
    }
    throw new Error('用户新增失败：'+ req.param);
  }
}

module.exports = UserService;