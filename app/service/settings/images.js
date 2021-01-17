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
      {imageDir, imageTitle, imageUrl, status, remark,} = req,
      createTime = await ctx.helper.getNowTime(),
      images = await ctx.model.Images.create({imageDir, imageTitle, imageUrl, status, remark, createTime,});
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
    const articlesCount = await ctx.model.Articles.count({'where': {'cover': images.imageUrl,},});
    if (articlesCount > 0) {
      ctx.throw(500, [1003, '请先去博文中替换图片再删除',]);
    }
    const userCount = await ctx.model.User.count({'where': {'avatar': images.imageUrl,},});
    if (userCount > 0) {
      ctx.throw(500, [1003, '请先去替换用户头像再删除',]);
    }
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
      url = images.imageUrl.replace(imageBaseUrl[0].configContent, ''),
      // 删除图床文件
      res = await service[imageStorage].delete(url);
    if (res) {
      return await images.destroy();
    }
    ctx.throw(500, [999, '删除失败',]);
  }

  async findImagesList(query) {
    const {ctx,} = this;
    return await ctx.model.Images.findAll({
      'where': query,
      'attributes': ['id', 'imageTitle', 'imageUrl',],
      'order': [['createTime', 'desc',],],
    });
  }
}

module.exports = ImagesService;
