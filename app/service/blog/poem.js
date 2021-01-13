'use strict';

const Service = require('egg').Service;

class PoemService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = await ctx.model.Poem.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'content', 'typeName', 'author', 'createTime',],
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
      {content, typeName, author,} = req,
      createTime = await ctx.helper.getNowTime(),
      poem = await ctx.model.Poem.create({content, typeName, author, createTime,});
    if (poem) {
      return poem.id;
    }
    ctx.throw(500, [999, '分类新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, content, typeName, author,} = req,
      poem = await ctx.model.Poem.findByPk(id);
    if (!poem) {
      ctx.throw(500, [1003, '信息不存在',]);
    }
    await poem.update({content, typeName, author,});
  }

  async delete(id) {
    const {ctx,} = this,
      poem = await ctx.model.Poem.findByPk(id);
    if (!poem) {
      ctx.throw(500, [1003, '信息不存在',]);
    }
    return await poem.destroy();
  }
}

module.exports = PoemService;
