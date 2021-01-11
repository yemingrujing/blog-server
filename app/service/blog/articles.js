'use strict';

const Service = require('egg').Service;

class ArticlesService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Category.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'categoryName', 'categoryAlias', 'categoryDescription', 'createTime',],
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
      {articleTitle, articleDes, keywords, articleContent, status, cover,} = req,
      createTime = await ctx.helper.getNowTime(),
      userId = ctx.session.userId,
      category = await ctx.model.Articles.create({userId, articleTitle, articleDes, keywords, articleContent, status, cover, createTime, });
    if (category) {
      return category.id;
    }
    ctx.throw(500, [999, '分类新增失败：' + JSON.stringify(req),]);
  }
}
