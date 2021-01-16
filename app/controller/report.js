'use strict';

const Controller = require('./base_controller');

class ReportController extends Controller {

  async search() {
    const {service,} = this,
      result = service.report.search();
    this.success(result, '报表查询');
  }

  async item() {
    const {ctx, service,} = this,
      key = ctx.request.body.key,
      result = service.report.item(key);
    this.success(result, '报表查询');
  }

  async category() {
    const {service,} = this,
      result = service.report.category();
    this.success(result, '报表查询');
  }

  async city() {
    const {service,} = this,
      result = service.report.city();
    this.success(result, '省市查询');
  }
}

module.exports = ReportController;
