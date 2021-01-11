'use strict';

const Service = require('egg').Service;

class ArticlesService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this;
  }

  async add(req) {
    const {ctx,} = this,
      {articleTitle, articleDes, keywords, articleContent, status, cover,} = req,
      transaction = await ctx.model.transaction(),
      createTime = await ctx.helper.getNowTime(),
      userId = ctx.session.userId,
      categoryId = param.categoryId;
    if (!categoryId) {
      ctx.throw(500, [999, '分类不能为空',]);
    }
    const tagId = param.tagId;
    if (!tagId && tag.length > 0) {
      ctx.throw(500, [999, '标签不能为空',]);
    }
    const articles = await ctx.model.Articles.create({
      userId,
      articleTitle,
      articleDes,
      keywords,
      articleContent,
      status,
      cover,
      createTime,
    }, {transaction,});
    if (!articles) {
      ctx.throw(500, [999, '分类新增失败：' + JSON.stringify(req),]);
    }
    const tagsInfo = [];
    tagId.map((id) => {
      tagsInfo.push({'tagId': id, 'artId': articles.id,});
      return id;
    });
    await ctx.model.ArtitleCategory.create({'artId': articles.id, categoryId,}, {transaction,});
    await ctx.model.ArtitleTag.bulkCreate(tagsInfo, {transaction,});
    await transaction.commit();
    return articles.id;
  }
}
