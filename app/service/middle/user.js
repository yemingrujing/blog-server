'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async login(username, password) {
    const {ctx,} = this,
      userInfo = await ctx.model.User.findOne({
        'where': {
          'userName': username,
          'userPassword': password,
          'status': 0,
        },
      });
    if (!userInfo) {
      ctx.throw(401, '登录失败，用户名/密码错误');
    }
    if (userInfo.status === 1) {
      ctx.throw(401, '用户已被禁用，请联系管理员');
    }
    return userInfo;
  }

  async userInfo() {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize'),
      role = await ctx.model.Role.findByPk(ctx.session.roleId);
    if (!role) {
      ctx.throw(500, [999, '无法获取角色信息',]);
    }
    if (role.delFlag === 1) {
      ctx.throw(500, [999, '角色不存在',]);
    }
    const permission = role.roleKey;
    let menuInfo = await ctx.model.query('SELECT\n' +
      '\tm.id AS id,\n' +
      '\tr.roleKey AS roleKey,\n' +
      '\tm.menuKey AS menuKey,\n' +
      '\tm.menuType AS menuType,\n' +
      '\tm.pMenuId AS pMenuId,\n' +
      '\tm.menuName AS menuName,\n' +
      '\tm.pageUrl AS pageUrl,\n' +
      '\tm.url AS url,\n' +
      '\tm.icon AS icon,\n' +
      '\tm.sort AS sort \n' +
      'FROM\n' +
      '\trole r\n' +
      '\tINNER JOIN relationship rs ON r.roleKey = rs.roleKey\n' +
      '\tLEFT JOIN menu m ON rs.menuId = m.id \n' +
      'WHERE\n' +
      '\tr.id = $roleId \n' +
      'ORDER BY\n' +
      '\tm.menuType,\n' +
      '\tm.sort', {'bind': {'roleId': ctx.session.roleId,}, 'type': QueryTypes.SELECT,})
      .then((result) => {
        return result;
      });
    return await service.api.user.permission(menuInfo, permission);
  }

  async setAvator(req) {
    const {ctx,} = this,
      {id, avatar,} = req,
      user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(500, [999, '用户不存在',]);
    }
    return user.update({avatar,});
  }

  async changePassword(req) {
    const {ctx,} = this,
      {id, password, newPassword,} = req,
      user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(500, [999, '用户不存在',]);
    }
    if (password && user.userPassword === password) {
      return user.update({'userPassword': newPassword,});
    }
    ctx.throw(500, [999, '修改密码失败，原密码不正确',]);
  }
}

module.exports = UserService;
