'use strict';

const Service = require('egg').Service;

class WebService extends Service {

  async search(req) {
    const {ctx,} = this,
      {categoryName, tagName, page,} = req,
      {QueryTypes,} = require('sequelize'),
      strList = categoryName ? '\tc.categoryName = &categoryName and\n' : tagName ? '\tc.categoryName = $tagName and\n' : '';
    let bind = {'page': (page * 10) - 10, 'limit': 10,};
    if (categoryName) {
      bind.categoryName = categoryName;
    }
    if (tagName) {
      bind.tagName = tagName;
    }
    const list = await ctx.model.query('SELECT\n' +
      '\ta.*,\n' +
      '\tc.id AS categoryId,\n' +
      '\tc.categoryName AS categoryName,\n' +
      '\tGROUP_CONCAT( t.id SEPARATOR \' \' ) tagId,\n' +
      '\tGROUP_CONCAT( t.tagName SEPARATOR \' \' ) tagName \n' +
      'FROM\n' +
      '\tarticles a\n' +
      '\tLEFT JOIN artitle_category ac ON ac.artId = a.id\n' +
      '\tLEFT JOIN category c ON c.id = ac.categoryId\n' +
      '\tLEFT JOIN artitle_tag ta ON ta.artId = a.id\n' +
      '\tLEFT JOIN tag t ON c.id = ta.tagId \n' +
      'WHERE\n' +
      '\ta.`status` = 1 \n' +
      strList +
      'GROUP BY\n' +
      '\ta.id \n' +
      'ORDER BY\n' +
      '\ta.createTime DESC \n' +
      '\tLIMIT $page,\n' +
      '\t$limit', {'bind': bind, 'type': QueryTypes.SELECT,}),
      total = await ctx.model.query('SELECT\n' +
        '\tcount( a.id )\n' +
        'FROM\n' +
        '\tarticles a\n' +
        '\tLEFT JOIN artitle_category ac ON ac.artId = a.id\n' +
        '\tLEFT JOIN category c ON c.id = ac.categoryId\n' +
        '\tLEFT JOIN artitle_tag ta ON ta.artId = a.id\n' +
        '\tLEFT JOIN tag t ON c.id = ta.tagId \n' +
        'WHERE\n' +
        '\ta.`status` = 1 \n' +
        strList +
        'GROUP BY\n' +
        '\ta.id \n' +
        'ORDER BY\n' +
        '\ta.createTime DESC \n' +
        '\tLIMIT $page,\n' +
        '\t$limit', {'bind': bind, 'type': QueryTypes.SELECT,});
    return {
      'total': total[0].count,
      'list': list,
    };

  }

  async info() {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize'),
      category = await ctx.model.query('SELECT\n' +
        '\ta.articleTitle AS articleTitle,\n' +
        '\tc.categoryName AS categoryName \n' +
        'FROM\n' +
        '\tartitle_category ac\n' +
        '\tINNER JOIN category c ON ac.categoryId = c.id\n' +
        '\tINNER JOIN articles a ON ac.artId = a.id', {'type': QueryTypes.SELECT,}),
      articles = await ctx.model.Articles.findAll({
        'attribute': ['id', 'articleTitle', 'updateTime', 'cover',],
        'order': [['updateTime', 'desc',],],
        'where': {
          'status': 1,
        },
      }),
      notice = await ctx.model.SystemConfig.findAll({
        'attribute': ['configContent',],
        'where': {
          'signKey': 'notice',
        },
      }),
      tags = await ctx.model.Tag.findAll({
        'attribute': ['id', 'tagName',],
      }),
      poems = await ctx.model.Poem.findAll({
        'attribute': ['content', 'author',],
      });
    return await service.api.web.homeData(category, articles, tags, poems, notice[0].configContent);
  }
}

module.exports = WebService;
