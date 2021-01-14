'use strict';

const Service = require('egg').Service;

class GalleryService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Gallery.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'title', 'describe', 'url', 'status', 'remark', 'createTime',],
        'where': query,
        'order': [['createTime', 'desc',],],
      });
    return {
      'total': !list.count ? 0 : list.count,
      'list': list.rows,
    };
  }

  async add(req) {
    const {ctx,} = this,
      {title, describe, url, status, remark,} = req,
      createTime = await ctx.helper.getNowTime(),
      gallery = await ctx.model.Gallery.create({title, describe, url, status, remark, createTime,});
    if (gallery) {
      return gallery.id;
    }
    ctx.throw(500, [999, '相册新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, title, describe, url, status, remark,} = req,
      gallery = await ctx.model.Gallery.findByPk(id);
    if (!gallery) {
      ctx.throw(500, [1003, '相册不存在',]);
    }
    return await gallery.update({
      title,
      describe,
      url,
      status,
      remark,
    });
  }

  async switch(req) {
    const {ctx,} = this,
      {id, status,} = req;
    if (!(status === 0 || status === 1)) {
      ctx.throw(500, [999, '参数错误',]);
    }
    const gallery = await ctx.model.Gallery.findByPk(id);
    if (!gallery) {
      ctx.throw(500, [999, '相册不存在',]);
    }
    return await gallery.update({status,});
  }


  async delete(id) {
    const {ctx,} = this,
      gallery = await ctx.model.Gallery.findByPk(id);
    if (!gallery) {
      ctx.throw(500, [1003, '相册不存在',]);
    }
    return await gallery.destroy();
  }
}

module.exports = GalleryService;
