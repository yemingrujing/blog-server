'use strict';

const Controller = require('../base_controller');

class WebController extends Controller {

  async search() {
    const {ctx, app, service,} = this,
      validator = await app.validator.validate({ 'page': { 'type': 'number', 'min': 1, }, }, ctx.request.body);
    if (validator) {
      this.error('参数错误', validator);
      return;
    }
    const result = await service.web.web.search(ctx.request.body);
    this.success(result, '查询');
  }

  async info() {
    const { service, } = this,
      result = await service.web.web.info();
    this.success(result, '查询');
  }

  async blogSearch() {
    const { ctx, service, } = this,
      query = {};
    if (ctx.request.body.keywords) {
      query.keywords = {'$like': `%${ctx.request.body.keywords}%`,};
    }
    const result = await service.web.web.blogSearch(query);
    this.success(result, '查询');
  }
}

module.exports = WebController;
