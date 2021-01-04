'use strict';

const Service = require('egg').Service;

class MenuService extends Service {

  async search() {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize'),
      menus = await ctx.model.query('SELECT\n' +
        '\t`id`,\n' +
        '\t`pMenuId`,\n' +
        '\t`menuName`,\n' +
        '\t`pageUrl`,\n' +
        '\t`url`,\n' +
        '\t`icon`,\n' +
        '\t`sort`\n' +
        'FROM\n' +
        '\t`menu` AS `menu` \n' +
        'ORDER BY\n' +
        '\t`menu`.`menuType` ASC,\n' +
        '\t`menu`.`sort` ASC', {'type': QueryTypes.SELECT,});
    return await service.util.tool.buildTree(menus);
  }

  async add(menuType, pMenuId, menuName, pageUrl, url, icon) {
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
    const menuKey = ctx.helper.md5Encode(ctx.helper.getUUID());
    return await ctx.model.Menu.create({menuType, menuKey, pMenuId, menuName, pageUrl, url, icon,});
  }

  async edit(id, pMenuId, menuType, menuName, pageUrl, url, icon) {
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
    return await menu.update({pMenuId, menuType, menuName, pageUrl, url, icon,});
  }

  async delete(id) {
    const {ctx,} = this,
      menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(500, [999, '无法获取到指定的菜单信息',]);
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
