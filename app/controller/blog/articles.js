'use staict';

const Controller = require('../base_controller');

class ArticlesController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.articleTitle) {
      query.articleTitle = {'$like': `%${ctx.request.body.articleTitle}%`,};
    }
    const result = await service.blog.articles.search(query, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.add(param);
    this.success(result, '新增');
  }
}
