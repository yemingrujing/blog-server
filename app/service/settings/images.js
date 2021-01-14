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
    const {ctx, service,} = this,
      images = await ctx.model.Images.findByPk(id);
    if (!images) {
      ctx.throw(500, [1003, '图片不存在',]);
    }
    const result = await images.destroy();
    if (result) {
      // 获取图床
      const imageStorage = await service.settings.systemConfig.imageStorage(),
        // 查询图床代理字段
        imageBaseUrl = await ctx.model.SystemConfig.findAll(
          {
            'attributes': ['configContent',],
            'where': {'signKey': 'imageBaseUrl',},
          }
        ),
        // 获取图片路径
        url = ctx.request.body.imageUrl.replace(imageBaseUrl[0].configContent, ''),
        // 删除图床文件
        res = await service[imageStorage].delete(url);
      return res;
    }
    ctx.throw(500, [999, '删除失败',]);


  }
}

module.exports = ImagesService;
