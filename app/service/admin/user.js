'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async search(param, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.User.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'userName', 'avatar', 'status', 'nickName', 'roleId', 'updateTime', 'remark', 'userEmail', 'userTelephoneNumber',],
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
      {userIp, password, userName, roleId, userEmail, userTelephoneNumber, nickName,} = req.param,
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
      user = await ctx.model.User.create({
        userIp,
        userName,
        'userPassword': password,
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

  async edit(req) {
    const {ctx,} = this,
      {id, password, roleId, userEmail, userTelephoneNumber, nickName, status,} = req.param,
      user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(500, [1003, '用户不存在',]);
    }
    const updateTime = ctx.helper.getNowTime(),
      avatar = req.param.avatar || 'https://raw.githubusercontent.com/SpectreAlan/images/master/blog/logo.png';
    return user.update({
      roleId,
      userEmail,
      userTelephoneNumber,
      nickName,
      status,
      avatar,
      'userPassword': password,
      updateTime,
    });
  }

  async onOff(id, status) {
    const {ctx,} = this;
    if (!(status === 0 || status === 1)) {
      ctx.throw(500, [1004, '参数错误',]);
    }
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(500, [1003, '用户不存在',]);
    }
    return user.update({status,});
  }

  async del(id) {
    const {ctx,} = this,
      user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(500, [1003, '用户不存在',]);
    }
    return user.destroy();
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
