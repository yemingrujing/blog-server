'use strict';

const Controller = require('../base_controller');

class ImagesController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.imageTitle) {
      query.imageTitle = {'$like': `%${ctx.request.body.imageTitle}%`,};
    }
    const result = await service.settings.images.search(query, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.settings.images.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.settings.images.edit(param);
    this.success(result, '编辑');
  }

  async switch() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.settings.images.switch(param);
    this.success(result, '开关');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.settings.images.delete(id);
    this.success(result, '删除');
  }
}

module.exports = ImagesController;
