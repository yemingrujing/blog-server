'use strict';

const Controller = require('../base_controller');

class ArticlesController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      articleTitle = ctx.request.body.articleTitle,
      result = await service.blog.articles.search(articleTitle, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.edit(param);
    this.success(result, '编辑');
  }

  async detail() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.detail(param.id);
    this.success(result, '查询');
  }

  async publish() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.publish(param);
    this.success(result, '发布');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.articles.delete(id);
    this.success(result, '发布');
  }
}

module.exports = ArticlesController;
