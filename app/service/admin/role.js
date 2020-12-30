'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  async search() {
    const {ctx,} = this;
    return await ctx.model.Role.findAll(
      {
        'attributes': ['id', 'roleName', 'roleKey',],
        'where': {'delFlag': 0,},
        'order': [['createTime', 'desc',],],
      });
  }

  async add(roleName) {
    const {ctx,} = this,
      role = await ctx.model.Role.create({
        roleName,
        'roleKey': ctx.helper.getUUID(),
        'createTime': ctx.helper.getNowTime(),
      });
    if (role) {
      return role.id;
    }
    ctx.throw(500, [999, '用户新增失败：' + roleName,]);
  }

  async edit(id, roleName) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    if (role.delFlag === 1) {
      ctx.throw(500, [999, '当前角色已被删除',]);
    }
    return await role.update({roleName,});
  }

  async delete(id) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    if (role.delFlag === 1) {
      ctx.throw(500, [999, '当前角色已被删除',]);
    }
    const delFlag = 1;
    return await role.update({delFlag,});
  }

  async addMenu(roleId, menuId) {
    const {ctx, service,} = this,
      role = await ctx.model.Role.findByPk(roleId);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    const count = await ctx.model.Relationship.count({
      'where': {'roleKey': role.roleKey, 'menuId': menuId,},
    });
    if (count > 0) {
      ctx.throw(500, [999, role.roleName + '角色已添加该菜单',]);
    }
    await service.admin.menu.queryById(menuId);
    return await ctx.model.Relationship.create({
      'roleKey': role.roleKey,
      menuId,
      'createTime': ctx.helper.getNowTime(),
    });
  }

  async delMenu(id) {
    const {ctx,} = this,
      relationship = await ctx.model.Relationship.findByPk(id);
    if (!relationship) {
      return null;
    }
    return await relationship.destroy();
  }
}

module.exports = RoleService;
