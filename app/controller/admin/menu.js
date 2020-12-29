'use strict';

const Controller = require('../base_controller');

class MenuController extends Controller {
  async search() {
    const {service,} = this,
      list = await service.admin.menu.search();
    this.success(list, '查询');
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      menu = await service.admin.menu.add(param.pMenuId, param.menuName, param.pageUrl, param.url);
    this.success(menu, '添加');
  }

  async edit() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      menu = await service.admin.menu.edit(param.id, param.pMenuId, param.menuName, param.pageUrl, param.url);
    this.success(menu, '编辑');
  }

  async delete() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      menu = await service.admin.menu.delete(param.id);
    this.success(menu, '删除');
  }
}

module.exports = MenuController;
