'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  async search() {
    const {ctx,} = this;
    return await ctx.model.Role.findAll(
      {
        'attributes':['id', 'roleName', 'roleKey',],
        'where': {'delFlag': 0,},
        'order': [['createTime', 'desc',],],});
  }

  async add(roleName) {
    const {ctx, } = this,
      roleKey = ctx.helper.getUUID(),
      createTime = ctx.helper.getNowTime(),
      role = await ctx.model.Role.create({roleName, roleKey, createTime,});
    if (role) {
      return role.id;
    }
    throw new Error('用户新增失败：'+ roleName);
  }

  async edit(id, roleName) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      throw new Error('无法获取到指定的角色信息');
    }
    if (role.delFlag === 1) {
      throw new Error('当前的角色信息已经被删除了');
    }
    return await role.update({roleName,});
  }

  async delete(id) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      throw new Error('无法获取到指定的角色信息');
    }
    if (role.delFlag === 1) {
      throw new Error('当前的角色信息已经被删除了');
    }
    const delFlag = 1;
    return await role.update({delFlag,});
  }
}

module.exports = RoleService;
