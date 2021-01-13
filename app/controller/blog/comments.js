'use strict';

const Controller = require('../base_controller');

class CommentsController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      articleTitle = ctx.request.body.articleTitle,
      result = await service.blog.comments.search(articleTitle, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.comments.add(param);
    this.success(result, '新增');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.comments.delete(id);
    this.success(result, '删除');
  }
}

module.exports = CommentsController;
