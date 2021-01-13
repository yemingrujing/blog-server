'use strict';

const Controller = require('../base_controller');

class PoemController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.typeName) {
      query.typeName = {'$like': `%${ctx.request.body.typeName}%`,};
    }
    const result = await service.blog.poem.search(query, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.poem.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.poem.edit(param);
    this.success(result, '编辑');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.poem.delete(id);
    this.success(result, '发布');
  }
}

module.exports = PoemController;
