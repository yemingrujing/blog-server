'use strict';

const Controller = require('../base_controller');

class RoleController extends Controller {
  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      result = await service.admin.role.search(limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      role = service.admin.role.add(param.roleName);
    this.success(role, '添加');
  }

  async edit() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,};
    if (!param.roleName || !param.delFlag) {
      this.error('参数不能为空', []);
    }
    const role = await service.admin.role.edit(param.id, param.roleName, param.delFlag);
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
      relationship = await service.admin.role.addMenu(param.roleId, param.menuIds);
    this.success(relationship, '添加');
  }

  async queryRoleMenu() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      relationship = await service.admin.role.queryRoleMenu(param.id);
    this.success(relationship, '查询');
  }

  async delMenu() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      relationship = await service.admin.role.delMenu(param.id);
    this.success(relationship, '删除');
  }
}

module.exports = RoleController;
