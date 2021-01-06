'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  async search(limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Role.findAndCountAll(
        {
          'offset': (page * limit) - limit,
          'limit': limit,
          'attributes': ['id', 'roleName', 'roleKey', 'delFlag', 'createTime',],
          'order': [['createTime', 'desc',],],
        });
    return {
      'total': list.count,
      'list': list.rows,
    };
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

  async addMenu(roleId, menuIds) {
    const {ctx,} = this,
      role = await ctx.model.Role.findByPk(roleId);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    let insertItem = [];
    // 并发操作，循环用for
    await Promise.all(menuIds.map(async (menuId) => {
      let count = await ctx.model.Relationship.count({
        'where': {'roleKey': role.roleKey, 'menuId': menuId,},
      });
      if (count > 0) {
        ctx.throw(500, [999, role.roleName + '角色已添加该菜单',]);
      }
      let mCount = await ctx.model.Menu.count({'where': {'id': menuId,},});
      ctx.logger.info('mCount：' + mCount);
      if (mCount <= 0) {
        ctx.throw(500, [999, '无法获取到指定的菜单信息，菜单ID：' + menuId,]);
      }
      insertItem.push({'roleKey': role.roleKey, menuId,});
    }));
    return await ctx.model.Relationship.bulkCreate(insertItem);
  }

  async queryRoleMenu(roleId) {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize'),
      role = await ctx.model.Role.findByPk(roleId);
    if (!role) {
      ctx.throw(500, [999, '无法获取到指定的角色信息',]);
    }
    const roleMenus = await ctx.model.query('SELECT\n' +
      '\tm.id,\n' +
      '\tr.id AS roleId,\n' +
      '\tr.roleKey,\n' +
      '\tr.roleName,\n' +
      '\tm.pMenuId,\n' +
      '\tm.menuName,\n' +
      '\tm.pageUrl,\n' +
      '\tm.url,\n' +
      '\tm.sort \n' +
      'FROM\n' +
      '\trole r\n' +
      '\tINNER JOIN relationship rs ON r.roleKey = rs.roleKey\n' +
      '\tINNER JOIN menu m ON rs.menuId = m.id \n' +
      'WHERE\n' +
      '\tr.id = $id \n' +
      'ORDER BY\n' +
      '\tm.menuType ASC,\n' +
      '\tm.sort ASC', {'bind': {'id': roleId,}, 'type': QueryTypes.SELECT,});

    return await service.util.tool.buildTree(roleMenus);
  }

  async delMenu(id) {
    const {ctx,} = this;
    return await ctx.model.Relationship.destroy({'where': {id,},});
  }
}

module.exports = RoleService;
