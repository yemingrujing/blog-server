'use strict';

const Service = require('egg').Service;

class ArticlesService extends Service {

  async search(articleTitle = null, limit = 10, page = 1) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize'),
      list = await ctx.model.query('SELECT\n' +
        '\tar.id AS id,\n' +
        '\tar.articleTitle AS articleTitle,\n' +
        '\tc.id AS categoryId,\n' +
        '\tc.categoryName AS categoryName,\n' +
        '\tGROUP_CONCAT( t.id SEPARATOR \',\' ) AS tagId,\n' +
        '\tGROUP_CONCAT( t.tagName SEPARATOR \',\' ) AS tagName,\n' +
        '\tar.articleViews AS articleViews,\n' +
        '\tar.cover AS cover,\n' +
        '\tar.STATUS AS status,\n' +
        '\tar.createTime AS createTime,\n' +
        '\tar.updateTime AS updateTime \n' +
        'FROM\n' +
        '\tarticles ar\n' +
        '\tLEFT JOIN artitle_category arc ON arc.artId = ar.id\n' +
        '\tLEFT JOIN category c ON c.id = arc.categoryId\n' +
        '\tLEFT JOIN artitle_tag art ON art.artId = ar.id\n' +
        '\tLEFT JOIN tag t ON t.id = art.tagId \n' +
        (!articleTitle ? '\t' : ('WHERE ar.articleTitle like \'%' + articleTitle + '%\'\n')) +
        'GROUP BY\n' +
        '\tar.id \n' +
        '\tLIMIT $page,\n' +
        '\t$limit', {'bind': {'page': (page * limit) - limit, 'limit': limit,}, 'type': QueryTypes.SELECT,}),
      total = await ctx.model.Articles.count({'where': (!articleTitle ? {} : {'articleTitle': {'$like': `%${articleTitle}%`,},}),});
    return {
      'total': total,
      'list': list,
    };
  }

  async add(req) {
    const {ctx,} = this,
      {articleTitle, articleDes, keywords, articleContent, cover,} = req,
      transaction = await ctx.model.transaction(),
      updateTime = await ctx.helper.getNowTime(),
      createTime = await ctx.helper.getNowTime(),
      userId = ctx.session.userId,
      categoryId = req.categoryId;
    if (!categoryId) {
      ctx.throw(500, [999, '分类不能为空',]);
    }
    let tagId = req.tagId;
    if (!tagId && tagId.length > 0) {
      ctx.throw(500, [999, '标签不能为空',]);
    }
    tagId = await ctx.helper.uniq(tagId);
    let status = req.status;
    if (!status) {
      status = 0;
    }
    ctx;
    const articles = await ctx.model.Articles.create({
      userId,
      articleTitle,
      articleDes,
      keywords,
      articleContent,
      status,
      cover,
      createTime,
      updateTime,
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

module.exports = ArticlesService;
