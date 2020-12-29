'use strict';

const Controller = require('../base_controller');

class RoleController extends Controller {
  async search() {
    const {service,} = this,
      list = await service.admin.role.search();
    this.success(list, '查询');
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      role = service.admin.role.add(param.roleName);
    this.success(role, '添加');
  }

  async edit() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      role = await service.admin.role.edit(param.id, param.roleName);
    this.success(role, '编辑');
  }

  async delete() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      role = await service.admin.role.delete(param.id);
    this.success(role, '删除');
  }

  async addMenu() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      relationship = await service.admin.role.addMenu(param.roleId, param.menuId);
    this.success(relationship, '角色添加菜单');
  }
}

module.exports = RoleController;
