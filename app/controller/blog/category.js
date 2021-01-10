'use strict';

const Controller = require('../base_controller');

class CategoryController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.categoryName) {
      query.categoryName = {'$like': `%${ctx.request.body.categoryName}%`,};
    }
    const result = await service.blog.category.search(query, limit, page);
    this.success(result, '查询');
  }

  async artSearch() {
    const {service,} = this,
      result = await service.blog.category.artSearch();
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.category.add(param);
    this.success(result, '查询');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.category.edit(param);
    this.success(result, '查询');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.category.delete(id);
    this.success(result, '查询');
  }
}

module.exports = CategoryController;
