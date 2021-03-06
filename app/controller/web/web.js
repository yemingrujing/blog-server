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

  async timeLine() {
    const {service,} = this,
      result = await service.web.web.timeLine();
    this.success(result, '查询');
  }

  async gallery() {
    const {service,} = this,
      result = await service.web.web.gallery();
    this.success(result, '查询');
  }

  async detail() {
    const {ctx, service,} = this,
      result = await service.web.web.detail(ctx.request.body.id);
    this.success(result, '查询');
  }

  async statistics() {
    const {service,} = this,
      result = await service.web.web.statistics();
    this.success(result, '查询');
  }

  async comment() {
    const {service,} = this,
      result = await service.web.web.comment();
    this.success(result, '评论');
  }
}

module.exports = WebController;
