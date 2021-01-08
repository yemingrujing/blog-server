'use strict';

const Service = require('egg').Service;

class MenuService extends Service {

  async search() {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize'),
      menus = await ctx.model.query('SELECT\n' +
        '\tm.`id`,\n' +
        '\tm.`pMenuId`,\n' +
        '\tm.`menuName`,\n' +
        '\tm.`pageUrl`,\n' +
        '\tm.`url`,\n' +
        '\tm.`menuType`,\n' +
        '\tm.`icon`,\n' +
        '\tm.`sort`,\n' +
        '\t( SELECT menuName FROM menu WHERE id = m.`pMenuId` ) AS parentName \n' +
        'FROM\n' +
        '\tmenu AS m \n' +
        'ORDER BY\n' +
        '\tm.`menuType` ASC,\n' +
        '\tm.`sort` ASC', {'type': QueryTypes.SELECT,});
    return await service.util.tool.buildTree(menus);
  }

  async add(menuType, pMenuId, menuName, pageUrl, url, icon, sort, remark) {
    const {ctx,} = this;
    if (!menuName) {
      ctx.throw(500, [999, '参数不能为空',]);
    }
    if (!pMenuId) {
      pMenuId = 0;
    }
    if (pMenuId > 0) {
      const pMenu = await ctx.model.Menu.findByPk(pMenuId);
      if (!pMenu) {
        ctx.throw(500, [999, '无法获取到父菜单信息',]);
      }
    }
    if (!menuType) {
      menuType = 0;
    }
    const count = await ctx.model.Menu.count({'where': {menuName, menuType,},});
    if (count > 0) {
      ctx.throw(500, [999, menuName + '菜单已存在',]);
    }
    const menuKey = ctx.helper.md5Encode(ctx.helper.getUUID());
    return await ctx.model.Menu.create({menuType, menuKey, pMenuId, menuName, pageUrl, url, icon, sort, remark,});
  }

  async edit(id, pMenuId, menuType, menuName, pageUrl, url, icon, sort, remark) {
    const {ctx,} = this;
    if (!menuName) {
      ctx.throw(500, [999, '参数不能为空',]);
    }
    if (!pMenuId) {
      pMenuId = 0;
    }
    const menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(500, [999, '无法获取到指定的菜单信息',]);
    }
    if (pMenuId > 0) {
      const pMenu = await ctx.model.Menu.findByPk(pMenuId);
      if (!pMenu) {
        ctx.throw(500, [999, '无法获取到父菜单信息',]);
      }
    }
    if (!menuType) {
      menuType = 0;
    }
    return await menu.update({pMenuId, menuType, menuName, pageUrl, url, icon, sort, remark,});
  }

  async delete(id) {
    const {ctx,} = this,
      menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(500, [999, '无法获取到指定的菜单信息',]);
    }
    let count = await ctx.model.Relationship.count({'where': {'menuId': id,},});
    if (count > 0) {
      ctx.throw(500, [999, '请先与角色解绑再删除',]);
    }
    count = await ctx.model.Menu.count({'where': {'pMenuId': id,},});
    if (count > 0) {
      ctx.throw(500, [999, '请先删除子菜单或按钮',]);
    }
    return await menu.destroy();
  }

  async queryById(id) {
    const {ctx,} = this,
      menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(500, [999, '无法获取到指定的菜单信息',]);
    }
    return menu;
  }
}

module.exports = MenuService;
