'use strict';

const Service = require('egg').Service;

class ReportService extends Service {

  async dashboard() {
    const {ctx,} = this,
      images = await ctx.model.Images.count(),
      article = await ctx.model.Articles.count(),
      comment = await ctx.model.Comments.count(),
      visitors = await ctx.model.SystemConfig.findAll({
        'where': {'signKey': 'visitors',},
        'attribute': ['configContent',],
      });
    return {
      images,
      article,
      comment,
      'visitors': Number(visitors[0].configContent),
    };
  }

  async city() {
    const {ctx,} = this;
    return ctx.model.City.findAll({
      'attributes': ['cityName', 'x', 'y', 'n',],
    });
  }
}

module.exports = ReportService;
