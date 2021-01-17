'use strict';

const Service = require('egg').Service;

class ReportService extends Service {

  async search() {
    const {ctx,} = this,
      images = await ctx.model.Images.count(),
      article = await ctx.model.Articles.count(),
      comment = await ctx.model.Comments.count(),
      statistics = await ctx.model.Statistics.count(),
      visitors = await ctx.model.SystemConfig.findAll({
        'where': {'signKey': 'visitors',},
        'attribute': ['configContent',],
      });
    return {
      images,
      article,
      comment,
      statistics,
      'visitors': Number(visitors[0].configContent),
    };
  }

  async item(key) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize');
    let month = new Date().getMonth() + 1,
      year = new Date().getFullYear();
    const arr = [];
    for (let i = 0; i < 6; i++) {
      ctx.logger.info('year', year);
      ctx.logger.info('month', month);
      const data = await ctx.model.query('select count(id) AS count from ' + key + ' where date(createTime) ' +
        'between \'' + year +
        '-' + month +
        '-01\' and \'' + year +
        '-' + month +
        '-31\'', {
        'type': QueryTypes.SELECT,
      });
      ctx.logger.info('data：' + JSON.stringify(data));
      arr.push(data[0].count);
      --month;
      if (month < 1) {
        month = 12;
        --year;
      }
    }
    return arr.reverse();
  }

  async category() {
    const {ctx,} = this,
      list = await ctx.model.Statistics.findAll({
        'attribute': ['browserName', 'cityName',],
      });
    return this.itemd(list);
  }

  async city() {
    const {ctx,} = this;
    return await ctx.model.City.findAll({
      'attributes': ['cityName', 'x', 'y', 'n',],
    });
  }

  async itemd(list) {
    const browsers = {},
      cities = {};
    for (let i = 0; i < list.length; i++) {
      const browserName = list[i].browserName || '其他';
      if (browsers[browserName]) {
        browsers[browserName] = browsers[browserName] + 1;
      } else {
        browsers[browserName] = 1;
      }
      const cityName = this.getSection(list[i].cityName);
      if (cities[cityName]) {
        cities[cityName] = cities[cityName] + 1;
      } else {
        cities[cityName] = 1;
      }
    }
    const city = [],
      browser = [];
    for (const i in browsers) {
      const o = {};
      o.name = i;
      o.value = browsers[i];
      browser.push(o);
    }
    for (const i in cities) {
      const o = {};
      o.name = i;
      o.value = cities[i];
      city.push(o);
    }
    city.sort((a, b) => b.value - a.value);
    return {browser, city,};
  }

  getSection(section) {
    if (!section) {
      return '地球';
    }
    if (section.includes('省')) {
      return section.split('省')[0] + '省';
    }
    if (section.includes('自治区')) {
      return section.split('自治区')[0] + '自治区';
    }
    if (section.includes('市')) {
      return section.split('市')[0] + '市';
    }
    return section;
  }
}

module.exports = ReportService;
