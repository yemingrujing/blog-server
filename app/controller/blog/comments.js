'use strict';

const Controller = require('../base_controller');

class CommentsController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.categoryName) {
      query.categoryName = {'$like': `%${ctx.request.body.categoryName}%`,};
    }
    const result = await service.blog.comments.search(query, limit, page);
    this.success(result, '查询');
  }

}

module.exports = CommentsController;
