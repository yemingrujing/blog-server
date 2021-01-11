'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

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

  async artSearch() {
    const {ctx,} = this;
    return await ctx.model.Category.findAll({
      'attributes': [['id', 'categoryId',], 'categoryName',],
    });
  }

  async add(req) {
    const {ctx,} = this,
      {categoryName, categoryDescription,} = req,
      createTime = await ctx.helper.getNowTime(),
      category = await ctx.model.Category.create({categoryName, categoryAlias, categoryDescription, createTime,});
    if (category) {
      return category.id;
    }
    ctx.throw(500, [999, '分类新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, categoryName, categoryAlias, categoryDescription,} = req,
      category = await ctx.model.Category.findByPk(id);
    if (!category) {
      ctx.throw(500, [1003, '分类不存在',]);
    }
    return await category.update({
      categoryName,
      categoryAlias,
      categoryDescription,
    });
  }

  async delete(id) {
    const {ctx,} = this,
      category = await ctx.model.Category.findByPk(id);
    if (!category) {
      ctx.throw(500, [1003, '分类不存在',]);
    }
    const artCategoryCount = await ctx.model.ArtitleCategory.count({'where': {'categoryId': id,},});
    if (artCategoryCount > 0) {
      ctx.throw(500, [999, '请先与文章解绑再删除',]);
    }
    return await category.destroy();
  }

  async belong(id) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize');
    return await ctx.model.query('SELECT\n' +
      '\tar.id AS id,\n' +
      '\tar.articleTitle AS articleTitle,\n' +
      '\tc.categoryName AS categoryName,\n' +
      '\tGROUP_CONCAT( t.tagName SEPARATOR \' \' ) AS tagName,\n' +
      '\tar.`status` AS STATUS,\n' +
      '\tar.updateTime AS updateTime \n' +
      'FROM\n' +
      '\tartitle_category arc\n' +
      '\tINNER JOIN articles ar ON ar.id = arc.artId\n' +
      '\tINNER JOIN category c ON c.id = arc.categoryId\n' +
      '\tLEFT JOIN artitle_tag art ON art.artId = ar.id\n' +
      '\tLEFT JOIN tag t ON t.id = art.tagId \n' +
      'WHERE\n' +
      '\tc.id = $id \n' +
      'GROUP BY\n' +
      '\tar.id;', {'bind': {'id': id,}, 'type': QueryTypes.SELECT,});
  }
}

module.exports = CategoryService;
