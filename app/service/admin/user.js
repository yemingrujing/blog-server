'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async search(param, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.User.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'userName', 'avatar', 'status', 'nickName', 'roleId', 'updateTime', 'remark',],
        'where': param,
        'order': [['userRegistTime', 'desc',],],
      });
    return {
      'total': list.count,
      'list': list.rows,
    };
  }

  async add(req) {
    const {ctx,} = this,
      {userIp, userName, roleId, userEmail, userTelephoneNumber, nickName,} = req.param,
      count = await ctx.model.User.count({
        'where': {
          'userName': username,
          'status': 0,
        },
      });
    if (count > 0) {
      ctx.throw(500, [1002, '用户已存在',]);
    }
    const userRegistTime = ctx.helper.getNowTime(),
      updateTime = ctx.helper.getNowTime(),
      theme = req.param.theme || '#304156',
      avatar = req.param.avatar || 'https://raw.githubusercontent.com/SpectreAlan/images/master/blog/logo.png',
      status = 0,
      userPassword = ctx.helper.md5Encode(req.param.userPassword),
      user = await ctx.model.User.create({
        userIp,
        userName,
        userPassword,
        roleId,
        userEmail,
        avatar,
        userRegistTime,
        userTelephoneNumber,
        nickName,
        theme,
        status,
        updateTime,
      });
    if (user) {
      return user.id;
    }
    ctx.throw(500, [999, '用户新增失败：' + req.param,]);
  }

  async roles() {
    const {ctx,} = this;
    return await ctx.model.Role.findAll({
      'attributes': ['id', 'roleName',],
      'where': {'delFlag': 0,},
      'order': [['createTime', 'asc',],],
    });
  }
}

module.exports = UserService;
