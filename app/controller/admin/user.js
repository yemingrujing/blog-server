'use strict';

const Controller = require('../base_controller');

class UserController extends Controller {
  async search() {
    const { ctx, } = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      offset = (page*limit) - limit,
      query = {
        'userName': { '$like': `%${ctx.request.body.userName}%`, },
      },
      result = await ctx.service.admin.user.search(query, limit, offset);
    this.success({result, 'type': '查询',});
  }

  async add() {
    const { service, ctx,} = this,
      param = {...ctx.request.body,};
    ctx.logger.info('Controller用户新增参数：%j', param);
    const result = await service.admin.user.add({param,});
    this.success({result, 'type': '添加',});
  }
}

module.exports = UserController;
