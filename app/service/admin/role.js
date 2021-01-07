'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  async search(limit = 10, page = 1, roleName = null) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize');
    ctx.logger.info('roleName：' + roleName);
    const list = await ctx.model.query('SELECT\n' +
      '\tr.id,\n' +
      '\tr.roleName,\n' +
      '\tr.roleKey,\n' +
      '\tr.delFlag,\n' +
      '\tr.createTime,\n' +
      '\tGROUP_CONCAT( m.id SEPARATOR \',\' ) AS menuIds\n' +
      'FROM\n' +
      '\trole r\n' +
      '\tLEFT JOIN relationship rs ON r.roleKey = rs.roleKey\n' +
      '\tLEFT JOIN menu m ON rs.menuId = m.id \n' +
      (!roleName ? '\t' : ('WHERE r.roleName like \'%' + roleName + '%\'\n')) +
        'GROUP BY\n' +
        '\tr.id \n' +
        'ORDER BY\n' +
        '\tr.createTime DESC \n' +
        '\tLIMIT $page,\n' +
        '\t$limit', {'bind': {'page': (page * limit) - limit, 'limit': limit,}, 'type': QueryTypes.SELECT,}),
      total = await ctx.model.Role.count({});
    return {
      'total': total,
      'list': list,
    };
  }

  async add(roleName, delFlag, menuIds) {
    const {ctx,} = this;
    let transaction = await ctx.model.transaction();
    try {
      const role = await ctx.model.Role.create({
        roleName,
        'roleKey': ctx.helper.getUUID(),
        delFlag,
        'createTime': ctx.helper.getNowTime(),
      }, {transaction,});
      if (role) {
        await this.addMenu(role.roleKey, role.roleName, menuIds);
        await transaction.commit();
        return role;
      }
      ctx.throw(500, [999, '用户新增失败：' + roleName,]);
    } catch (error) {
      await transaction.rollback();
      ctx.throw(500, [999, error,]);
    }
  }

  async edit(id, roleName, delFlag, menuIds) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    let transaction = await this.ctx.model.transaction();
    try {
      await role.update({roleName, delFlag,}, {transaction,});
      if (menuIds.length > 0) {
        await this.addMenu(role.roleKey, role.roleName, menuIds);
      }
      await transaction.commit();
      return role;
    } catch (error) {
      await transaction.rollback();
      ctx.throw(500, [999, '更新失败',]);
    }
  }

  async delete(id) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(id);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    const count = await ctx.model.Relationship.count({'where': {'roleKey': role.roleKey,},});
    if (count > 0) {
      ctx.throw(500, [999, '请先与菜单解绑再删除',]);
    }
    return await role.destroy();
  }
}

module.exports = RoleService;
