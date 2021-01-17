'use strict';

const Controller = require('./base_controller');

class ReportController extends Controller {

  async search() {
    const {service,} = this,
      result = await service.report.search();
    this.success(result, '报表查询');
  }

  async item() {
    const {ctx, service,} = this,
      key = await ctx.request.body.key,
      result = await service.report.item(key);
    this.success(result, '报表查询');
  }

  async category() {
    const {service,} = this,
      result = await service.report.category();
    this.success(result, '报表查询');
  }

  async city() {
    const {service,} = this,
      result = await service.report.city();
    this.success(result, '省市查询');
  }
}

module.exports = ReportController;
