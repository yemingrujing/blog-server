'use strict';

const Controller = require('../base_controller');

class UserController extends Controller {
  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.userName) {
      query.userName = {'$like': `%${ctx.request.body.userName}%`,};
    }
    const result = await service.admin.user.search(query, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      result = await service.admin.user.add({param,});
    this.success(result, '添加');
  }

  async roles() {
    const {service, ctx,} = this,
      param = {...ctx.request.body,},
      result = await service.admin.user.roles({param,});
    this.success(result, '查询角色');
  }
}

module.exports = UserController;
