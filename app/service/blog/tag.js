'use strict';

const Service = require('egg').Service;

class TagService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Tag.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'tagName', 'tagAlias', 'tagDescription', 'createTime',],
        'where': query,
        'order': [['createTime', 'desc',],],
      });
    return {
      'total': !list.count ? 0 : list.count,
      'list': list.rows,
    };
  }

  async artSearch() {
    const {ctx,} = this;
    return await ctx.model.Tag.findAll({
      'attributes': [['id', 'tagId',], 'tagName',],
    });
  }

  async add(req) {
    const {ctx,} = this,
      {tagName, tagAlias, tagDescription,} = req,
      createTime = await ctx.helper.getNowTime(),
      tag = await ctx.model.Tag.create({tagName, tagAlias, tagDescription, createTime,});
    if (tag) {
      return tag.id;
    }
    ctx.throw(500, [999, '标签新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, tagName, tagAlias, tagDescription,} = req,
      tag = await ctx.model.Tag.findByPk(id);
    if (!tag) {
      ctx.throw(500, [1003, '标签不存在',]);
    }
    return await tag.update({
      tagName,
      tagAlias,
      tagDescription,
    });
  }

  async delete(id) {
    const {ctx,} = this,
      tag = await ctx.model.Tag.findByPk(id);
    if (!tag) {
      ctx.throw(500, [1003, '标签不存在',]);
    }
    const artTagCount = await ctx.model.ArtitleTag.count({'where': {'tagId': id,},});
    if (artTagCount > 0) {
      ctx.throw(500, [999, '请先与文章解绑再删除',]);
    }
    return await tag.destroy();
  }

  async belong(id) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize');
    return await ctx.model.query('SELECT\n' +
      '\t* \n' +
      'FROM\n' +
      '\t(\n' +
      '\tSELECT\n' +
      '\t\tar.id AS id,\n' +
      '\t\tGROUP_CONCAT( t.id SEPARATOR \',\' ) AS tagId,\n' +
      '\t\tar.articleTitle AS articleTitle,\n' +
      '\t\tc.categoryName AS categoryName,\n' +
      '\t\tGROUP_CONCAT( t.tagName SEPARATOR \' \' ) AS tagName,\n' +
      '\t\tar.`status` AS STATUS,\n' +
      '\t\tar.updateTime AS updateTime \n' +
      '\tFROM\n' +
      '\t\tartitle_tag art\n' +
      '\t\tINNER JOIN articles ar ON ar.id = art.artId\n' +
      '\t\tINNER JOIN tag t ON t.id = art.tagId\n' +
      '\t\tLEFT JOIN artitle_category arc ON arc.artId = ar.id\n' +
      '\t\tLEFT JOIN category c ON c.id = arc.categoryId \n' +
      '\tGROUP BY\n' +
      '\t\tar.id \n' +
      '\t) temp \n' +
      'WHERE\n' +
      '\tFIND_IN_SET( $id, temp.tagId )', {'bind': {'id': id,}, 'type': QueryTypes.SELECT,});
  }
}

module.exports = TagService;
