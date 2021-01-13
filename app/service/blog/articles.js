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
      {articleTitle, articleDes, keywords, articleContent, cover, tic, status,} = req,
      transaction = await ctx.model.transaction(),
      updateTime = await ctx.helper.getNowTime(),
      createTime = await ctx.helper.getNowTime(),
      userId = ctx.session.userId,
      categoryId = req.categoryId;
    if (!categoryId) {
      ctx.throw(500, [999, '分类不能为空',]);
    }
    let tagIds = req.tagId;
    if (!tagIds || tagIds.length === 0) {
      ctx.throw(500, [999, '标签不能为空',]);
    }
    tagIds = await ctx.helper.uniq(tagIds);
    const articles = await ctx.model.Articles.create({
      userId,
      articleTitle,
      articleDes,
      keywords,
      articleContent,
      status,
      cover,
      tic,
      createTime,
      updateTime,
    }, {transaction,});
    if (!articles) {
      ctx.throw(500, [999, '分类新增失败：' + JSON.stringify(req),]);
    }
    const tagsInfo = [];
    tagIds.map((tagId) => {
      tagsInfo.push({tagId, 'artId': articles.id,});
      return tagId;
    });
    await ctx.model.ArtitleCategory.create({'artId': articles.id, categoryId,}, {transaction,});
    await ctx.model.ArtitleTag.bulkCreate(tagsInfo, {transaction,});
    await transaction.commit();
    return articles.id;
  }

  async edit(req) {
    const {ctx,} = this,
      {id, articleTitle, articleDes, keywords, articleContent, cover, tic, status,} = req,
      transaction = await ctx.model.transaction(),
      categoryId = req.categoryId;
    if (!categoryId) {
      ctx.throw(500, [999, '分类不能为空',]);
    }
    let tagIds = req.tagId;
    if (!tagIds || tagIds.length === 0) {
      ctx.throw(500, [999, '标签不能为空',]);
    }
    tagIds = await ctx.helper.uniq(tagIds);
    const articles = await ctx.model.Articles.findByPk(id);
    if (!articles) {
      ctx.throw(500, [999, '博文不存在',]);
    }
    await articles.update({
      articleTitle,
      articleDes,
      keywords,
      articleContent,
      cover,
      tic,
      status,
    }, {transaction,});
    const tagsInfo = [];
    tagIds.map((tagId) => {
      tagsInfo.push({tagId, 'artId': articles.id,});
      return id;
    });
    await ctx.model.ArtitleCategory.update({categoryId,}, {'where': {'artId': articles.id,},}, {transaction,});
    await ctx.model.ArtitleTag.destroy({'where': {'artId': articles.id,},}, {transaction,});
    await ctx.model.ArtitleTag.bulkCreate(tagsInfo, {transaction,});
    await transaction.commit();
    return articles.id;
  }

  async detail(id) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize'),
      articles = await ctx.model.query('SELECT\n' +
        '\tid AS id,\n' +
        '\tarticleContent AS articleContent,\n' +
        '\tarticleTitle AS articleTitle,\n' +
        '\tarticleDes AS articleDes,\n' +
        '\tkeywords AS keywords,\n' +
        '\tSTATUS AS STATUS,\n' +
        '\tcover AS cover,\n' +
        '\ttic AS tic,\n' +
        '\t\'\' AS categoryId,\n' +
        '\t\'\' AS tagId \n' +
        'FROM\n' +
        '\tarticles \n' +
        'WHERE\n' +
        '\tid = $id', {'bind': {'id': id,}, 'type': QueryTypes.SELECT,});
    if (!articles || articles.length === 0) {
      ctx.throw(500, [999, '查询不到有效的分类信息',]);
    }
    const article = articles[0],
      categoryIds = await ctx.model.ArtitleCategory.findAll({
        'attributes': ['categoryId',],
        'where': {'artId': id,},
      }),
      tagIds = await ctx.model.ArtitleTag.findAll({
        'attributes': ['tagId',],
        'where': {'artId': id,},
      });
    article.categoryId = categoryIds[0].categoryId;
    article.tagId = [];
    tagIds.map((item) => {
      article.tagId.push(item.tagId);
      return item.tagId;
    });
    return article;
  }

  async publish(req) {
    const {ctx,} = this,
      {id, status,} = req;
    if (!(status === 0 || status === 1)) {
      ctx.throw(500, [999, '参数错误',]);
    }
    const articles = await ctx.model.Articles.findByPk(id);
    if (!articles) {
      ctx.throw(500, [999, '博文不存在',]);
    }
    return await articles.update({status,});
  }

  async delete(id) {
    const {ctx,} = this,
      transaction = await ctx.model.transaction(),
      articles = await ctx.model.Articles.findByPk(id);
    if (!articles) {
      ctx.throw(500, [999, '博文不存在',]);
    }
    await articles.destroy({transaction,});
    await ctx.model.ArtitleCategory.destroy({'where': {'artId': articles.id,},}, {transaction,});
    await ctx.model.ArtitleTag.destroy({'where': {'artId': articles.id,},}, {transaction,});
    await transaction.commit();
    return articles;
  }
}

module.exports = ArticlesService;
