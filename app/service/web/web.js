'use strict';

const Service = require('egg').Service;

class WebService extends Service {

  async search(req) {
    const {ctx,} = this,
      {categoryName, tagName, page,} = req,
      {QueryTypes,} = require('sequelize'),
      strList = categoryName ? '\tand c.categoryName = &categoryName \n' : tagName ? '\tand t.tagName = $tagName\n' : '';
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
      '\tLEFT JOIN tag t ON t.id = ta.tagId \n' +
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
        '\tcount( temp.id ) AS count \n' +
        'FROM\n' +
        '\t(\n' +
        '\tSELECT\n' +
        '\t\ta.id \n' +
        '\tFROM\n' +
        '\t\tarticles a\n' +
        '\t\tLEFT JOIN artitle_category ac ON ac.artId = a.id\n' +
        '\t\tLEFT JOIN category c ON c.id = ac.categoryId\n' +
        '\t\tLEFT JOIN artitle_tag ta ON ta.artId = a.id\n' +
        '\t\tLEFT JOIN tag t ON t.id = ta.tagId \n' +
        '\tWHERE\n' +
        '\t\ta.`status` = 1 \n' +
        strList +
        '\tGROUP BY\n' +
        '\ta.id \n' +
        '\t) temp', {'bind': bind, 'type': QueryTypes.SELECT,});
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
        'attributes': ['id', 'articleTitle', 'updateTime', 'cover',],
        'where': {
          'status': 1,
        },
        'order': [['updateTime', 'desc',],],
      }),
      notice = await ctx.model.SystemConfig.findAll({
        'attributes': ['configContent',],
        'where': {
          'signKey': 'notice',
        },
      }),
      tags = await ctx.model.Tag.findAll({
        'attributes': ['id', 'tagName',],
      }),
      poems = await ctx.model.Poem.findAll({
        'attributes': ['content', 'author',],
      });
    return await service.api.web.homeData(category, articles, tags, poems, notice[0].configContent);
  }

  async blogSearch(query) {
    const {ctx,} = this;
    return await ctx.model.Articles.findAll({
      'attributes': ['id', ['articleTitle', 'title',],],
      'where': query,
      'order': [['updateTime', 'desc',],],
    });
  }

  async timeLine() {
    const {ctx,} = this,
      list = await ctx.model.Articles.findAll({
        'attributes': ['id', 'cover', 'articleTitle', 'createTime',],
        'order': [['createTime', 'desc',],],
      }),
      image = await ctx.helper.cover();
    return {list, image,};
  }

  async gallery() {
    const {ctx,} = this,
      list = await ctx.model.Gallery.findAll({
        'attributes': ['title', 'describe', 'originTime', 'updateTime', 'url',],
        'order': [['originTime', 'desc',],],
      }),
      image = await ctx.helper.cover();
    return {list, image,};
  }

  async statistics() {
    const {ctx, service,} = this,
      {QueryTypes,} = require('sequelize');
    await service.api.web.statistics();
    const total = await ctx.model.Statistics.count(),
      todayQuery = await ctx.model.query('select count(id) from statistics where TO_DAYS(now())=TO_DAYS(createTime)', {'type': QueryTypes.SELECT,}),
      today = todayQuery[0]['count(id)'],
      visitors = await ctx.model.SystemConfig.findAll({
        'attributes': ['configContent',],
        'where': {'signKey': 'visitors',},
      });
    return {
      'total': Number(visitors[0].configContent),
      'visitors': total,
      today,
    };
  }

  async detail(id) {
    const {ctx,} = this;
    const {QueryTypes,} = require('sequelize'),
      detail = await ctx.model.query('SELECT\n' +
        '\tart.id AS id,\n' +
        '\tart.articleContent AS articleContent,\n' +
        '\tart.tic AS tic,\n' +
        '\tart.articleTitle AS articleTitle,\n' +
        '\tart.createTime AS createTime,\n' +
        '\tart.updateTime AS updateTime,\n' +
        '\tart.articleDes AS articleDes,\n' +
        '\tc.categoryName AS categoryName,\n' +
        '\tart.articleViews AS readed,\n' +
        '\tart.keywords AS keywords,\n' +
        '\tGROUP_CONCAT( t.tagName SEPARATOR \' \' ) AS tagName \n' +
        'FROM\n' +
        '\tarticles art\n' +
        '\tINNER JOIN artitle_category act ON art.id = act.artId\n' +
        '\tLEFT JOIN category c ON act.categoryId = c.id\n' +
        '\tLEFT JOIN artitle_tag att ON art.id = att.artId\n' +
        '\tLEFT JOIN tag t ON att.tagId = t.id \n' +
        'WHERE\n' +
        '\tart.id = $id \n' +
        'GROUP BY\n' +
        '\tart.id', {'bind': {'id': id,}, 'type': QueryTypes.SELECT,}),
      result = detail[0];
    if (!result) {
      ctx.throw(500, [999, '查询文章失败，文章不存在',]);
    }
    result.recommend = await ctx.model.query('SELECT\n' +
      '\tart.id AS id,\n' +
      '\tart.articleTitle AS articleTitle,\n' +
      '\tart.createTime AS createTime,\n' +
      '\tart.cover AS cover \n' +
      'FROM\n' +
      '\tarticles art\n' +
      '\tINNER JOIN artitle_category act ON art.id = act.artId\n' +
      '\tLEFT JOIN category c ON act.categoryId = c.id \n' +
      'WHERE\n' +
      '\tc.categoryName = $categoryName \n' +
      'GROUP BY\n' +
      '\tart.id', {'bind': {'categoryName': result.categoryName,}, 'type': QueryTypes.SELECT,});
    result.comments = await ctx.model.query('SELECT\n' +
      '\tc.id AS id,\n' +
      '\tc.author AS author,\n' +
      '\tc.nickName AS nickName,\n' +
      '\ta.articleTitle AS articleTitle,\n' +
      '\tc.commentContent AS commentContent,\n' +
      '\tc.parentId AS parentId,\n' +
      '\tc.parentNickName AS parentNickName,\n' +
      '\tc.createTime AS createTime,\n' +
      '\tc.browserName AS browserName,\n' +
      '\tc.systemName AS systemName \n' +
      'FROM\n' +
      '\tcomments c\n' +
      '\tINNER JOIN articles a ON c.articleId = a.id \n' +
      'WHERE\n' +
      '\tc.articleId = $articleId \n' +
      '\tAND c.`status` = 1', {'bind': {'articleId': id,}, 'type': QueryTypes.SELECT,});
    result.cover = await ctx.helper.cover();
    result.id = id;
    await ctx.model.query('UPDATE articles \n' +
      'SET articleViews = IFNULL( articleViews, 0 ) + 1 \n' +
      'WHERE\n' +
      '\tid = $id', {'bind': {id,}, 'type': QueryTypes.UPDATE,});
    return result;
  }

  async comment() {
    const {service,} = this,
      param = await service.api.web.comment(),
      result = await service.blog.comments.add(param);
    return result;
  }
}

module.exports = WebService;
