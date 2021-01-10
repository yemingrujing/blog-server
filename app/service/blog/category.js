'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

  async search(query, limit = 10, page = 1) {
    const {ctx,} = this,
      list = ctx.model.Category.findAndCountAll({
        'offset': (page * limit) - limit,
        'limit': limit,
        'attributes': ['id', 'categoryName', 'categoryAlias', 'categoryDescription',],
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
    return ctx.model.Category.findAll({
      'attributes': ['id', 'categoryName',],
    });
  }

  async add(req) {
    const {ctx,} = this,
      {categoryName, categoryAlias, categoryDescription,} = req.param,
      createTime = ctx.helper.getNowTime(),
      category = ctx.model.Category.create({categoryName, categoryAlias, categoryDescription, createTime,});
    if (category) {
      return category.id;
    }
    ctx.throw(500, [999, '分类新增失败：' + req.param,]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, categoryName, categoryAlias, categoryDescription,} = req.param,
      category = ctx.model.Category.findByPk(id);
    if (!category) {
      ctx.throw(500, [1003, '分类不存在',]);
    }
    return category.update({
      categoryName,
      categoryAlias,
      categoryDescription,
    });
  }

  async delete(id) {
    const {ctx,} = this,
      category = ctx.model.Category.findByPk(id);
    if (!category) {
      ctx.throw(500, [1003, '分类不存在',]);
    }
    const artCategoryCount = ctx.model.ArtitleCategory.count({'where': {'categoryId': id,},});
    if (artCategoryCount > 0) {
      ctx.throw(500, [999, '请先与文章解绑再删除',]);
    }
    return category.destroy();
  }
}

module.exports = CategoryService;
