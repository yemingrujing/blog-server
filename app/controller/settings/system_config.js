'use strict';

const Controller = require('../base_controller');

class SystemConfigController extends Controller {

  async search() {
    const {service,} = this,
      result = await service.settings.systemConfig.search();
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.settings.systemConfig.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.settings.systemConfig.edit(param);
    this.success(result, '编辑');
  }
}

module.exports = SystemConfigController;
