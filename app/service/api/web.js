'use strict';

const Service = require('egg').Service;

class WebService extends Service {
  async homeData(category, articles, tags, poems, notice) {
    const res = {};
    for (let i = 0; i < category.length; i++) {
      if (res[category[i].categoryName]) {
        res[category[i].categoryName] = res[category[i].categoryName] + 1;
      } else {
        res[category[i].categoryName] = 1;
      }
    }
    const categories = [];
    for (const i in res) {
      const o = {};
      o.title = i;
      o.count = res[i];
      categories.push(o);
    }
    let poem = poems[Math.random() * (poems.length - 1)];
    poem = poem.content + ' _by_ ' + poem.author;
    const fullPage = this.ctx.helper.cover();
    return {'category': categories, articles, tags, fullPage, poem, notice,};
  }

  async comment() {
    const {ctx,} = this,
      param = {...ctx.request.body,},
      device = JSON.parse(ctx.request.header['user-agent']),
      Browser = device.getBrowser(),
      Os = device.getOS();
    param.browserName = Browser.name + ' ' + Browser.version;
    param.systemName = Os.name + ' ' + Os.version;
    return param;
  }
}

module.exports = WebService;
