'use strict';

const Service = require('egg').Service;

class TagService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = ctx.model.Tag.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'tagName', 'tagAlias', 'tagDescription',],
        'where': query,
        'order': [['createTime', 'desc',],],
      });
    return {
      'total': list.count,
      'list': list.rows,
    };
  }

  async artSearch() {
    const {ctx,} = this;
    return ctx.model.Tag.findAll({
      'attributes': ['id', 'tagName',],
    });
  }

  async add(req) {
    const {ctx,} = this,
      {tagName, tagAlias, tagDescription,} = req.param,
      createTime = ctx.helper.getNowTime(),
      tag = ctx.model.Tag.create({tagName, tagAlias, tagDescription, createTime,});
    if (tag) {
      return tag.id;
    }
    ctx.throw(500, [999, '标签新增失败：' + req.param,]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, tagName, tagAlias, tagDescription,} = req.param,
      tag = ctx.model.Tag.findByPk(id);
    if (!tag) {
      ctx.throw(500, [1003, '标签不存在',]);
    }
    return tag.update({
      tagName,
      tagAlias,
      tagDescription,
    });
  }

  async delete(id) {
    const {ctx,} = this,
      tag = ctx.model.Tag.findByPk(id);
    if (!tag) {
      ctx.throw(500, [1003, '标签不存在',]);
    }
    const artTagCount = ctx.model.ArtitleTag.count({'where': {'tagId': id,},});
    if (artTagCount > 0) {
      ctx.throw(500, [999, '请先与文章解绑再删除',]);
    }
    return tag.destroy();
  }
}

module.exports = TagService;
