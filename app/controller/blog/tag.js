'use strict';

const Controller = require('../base_controller');

class TagController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.tagName) {
      query.tagName = {'$like': `%${ctx.request.body.tagName}%`,};
    }
    const result = await service.blog.tag.search(query, limit, page);
    this.success(result, '查询');
  }

  async artSearch() {
    const {service,} = this,
      result = await service.blog.tag.artSearch();
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.tag.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.tag.edit(param);
    this.success(result, '编辑');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.tag.delete(id);
    this.success(result, '删除');
  }

  async belong() {
    const {ctx, service,} = this,
      id = ctx.request.body.tagId,
      result = await service.blog.tag.belong(id);
    this.success(result, '查询');
  }
}

module.exports = TagController;
