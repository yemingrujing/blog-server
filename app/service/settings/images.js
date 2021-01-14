'use strict';

const Service = require('egg').Service;

class ImagesService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Images.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'imageTitle', 'imageUrl', 'status', 'remark', 'createTime',],
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
      {imageTitle, imageUrl, status, remark,} = req,
      createTime = await ctx.helper.getNowTime(),
      images = await ctx.model.Images.create({imageTitle, imageUrl, status, remark, createTime,});
    if (images) {
      return images.id;
    }
    ctx.throw(500, [999, '图片新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, imageTitle, imageUrl, status, remark,} = req,
      images = await ctx.model.Images.findByPk(id);
    if (!images) {
      ctx.throw(500, [1003, '图片不存在',]);
    }
    return await images.update({
      imageTitle,
      imageUrl,
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
    const images = await ctx.model.Images.findByPk(id);
    if (!images) {
      ctx.throw(500, [999, '图片不存在',]);
    }
    return await images.update({status,});
  }


  async delete(id) {
    const {ctx,} = this,
      images = await ctx.model.Images.findByPk(id);
    if (!images) {
      ctx.throw(500, [1003, '图片不存在',]);
    }
    return await images.destroy();
  }
}

module.exports = ImagesService;
