'use strict';

const Service = require('egg').Service;

class MenuService extends Service {

  async search() {
    const {ctx,} = this;
    return await ctx.model.Menu.findAll({
      'attributes': ['id', 'pMenuId', 'menuName', 'url',],
    });
  }

  async add(pMenuId, menuName, url) {
    const {ctx, } = this;
    if (!pMenuId) {
      pMenuId = 0;
    }
    if (pMenuId > 0) {
      const pMenu = await ctx.model.Menu.findByPk(pMenuId);
      if (!pMenu) {
        ctx.throw(500, '无法获取到父菜单信息');
      }
    }
    return await ctx.model.Menu.create({pMenuId, menuName, url,});
  }

  async edit(id, pMenuId, menuName, url) {
    const {ctx, } = this;
    if (!menuName || !url) {
      ctx.throw(500, '参数不能为空');
    }
    if (!pMenuId) {
      pMenuId = 0;
    }
    const menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(422, '无法获取到指定的菜单信息');
    }
    if (pMenuId > 0) {
      const pMenu = await ctx.model.Menu.findByPk(pMenuId);
      if (!pMenu) {
        ctx.throw(500, '无法获取到父菜单信息');
      }
    }
    return await menu.update({pMenuId, menuName, url,});
  }

  async delete(id) {
    const {ctx,} = this,
      menu = await ctx.model.Menu.findByPk(id);
    if (!menu) {
      ctx.throw(500, '无法获取到指定的菜单信息');
    }
    return await menu.destroy();
  }
}

module.exports = MenuService;
