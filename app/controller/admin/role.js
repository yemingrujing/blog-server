'use strict';

const Controller = require('../base_controller');

class RoleController extends Controller {
  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      roleName = ctx.request.body.roleName,
      result = await service.admin.role.search(limit, page, roleName);
    this.success(result, '查询');
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,};
    let delFlag = param.delFlag;
    if (!delFlag) {
      delFlag = 0;
    }
    if (!param.menuIds) {
      this.error('菜单不能为空', []);
    }
    let menuIds = param.menuIds.split(',');
    const role = service.admin.role.add(param.roleName, delFlag, menuIds);
    this.success(role, '添加');
  }

  async edit() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,};
    if (!param.roleName || !param.delFlag) {
      this.error('参数不能为空', []);
    }
    if (!(param.delFlag === 0 || param.delFlag === 1)) {
      this.error('状态不能为空', []);
    }
    if (!param.menuIds) {
      this.error('菜单不能为空', []);
    }
    let menuIds = param.menuIds ? param.menuIds.split(',') : [];
    const role = await service.admin.role.edit(param.id, param.roleName, param.delFlag, menuIds);
    this.success(role, '编辑');
  }

  async delete() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      role = await service.admin.role.delete(param.id);
    this.success(role, '删除');
  }
}

module.exports = RoleController;
