'use strict';

const Controller = require('../base_controller');

class RoleController extends Controller {
  async search() {
    const {service,} = this,
      total = await service.sql.selectCount('role'),
      list = await service.sql.select({'table': role,});
    this.success({'result':{total, list,},});
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,};
    param.createTime = service.tool.time();
    const result = service.sql.insert({'table': 'role', param,});
    this.success({result, 'type': '添加',});
  }

  async edit() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      result = await service.sql.update({'table': 'role', param,});
    this.success({result, 'type':'编辑',});
  }

  async delete() {
    const result = await this.service.sql.delete({'table': 'role',});
    this.success({result, 'type':'删除',});
  }
}

module.exports = RoleController;
