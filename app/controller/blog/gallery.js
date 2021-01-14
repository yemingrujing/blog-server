'use strict';

const Controller = require('../base_controller');

class GalleryController extends Controller {

  async search() {
    const {ctx, service,} = this,
      limit = Number(ctx.request.body.limit) || 10,
      page = Number(ctx.request.body.page) || 1,
      query = {};
    if (ctx.request.body.title) {
      query.title = {'$like': `%${ctx.request.body.title}%`,};
    }
    const result = await service.blog.gallery.search(query, limit, page);
    this.success(result, '查询');
  }

  async add() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.gallery.add(param);
    this.success(result, '新增');
  }

  async edit() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.gallery.edit(param);
    this.success(result, '编辑');
  }

  async switch() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.blog.articles.switch(param);
    this.success(result, '开关');
  }

  async delete() {
    const {ctx, service,} = this,
      id = ctx.request.body.id,
      result = await service.blog.gallery.delete(id);
    this.success(result, '删除');
  }
}

module.exports = GalleryController;
