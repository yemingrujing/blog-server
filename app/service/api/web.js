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

  async statistics() {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize'),
      visitIp = ctx.request.header['x-real-ip'];
    await ctx.model.update('UPDATE system_config \n' +
      'SET configContent = IFNULL( configContent, 0 ) + 1 \n' +
      'WHERE\n' +
      '\tsignKey = \'visitors\'', {'type': QueryTypes.UPDATE,});
    if (!ctx.session.ip) {
      ctx.session.ip = ipAddr;
      const device = JSON.parse(ctx.request.header['user-agent']),
        Browser = device.getBrowser(),
        Os = device.getOS(),
        systemName = (Os.name || 'Windows 10') + ' ' + (Os.version || ''),
        createTime = await ctx.helper.getNowTime(),
        region = await ctx.helper.getRegion(visitIp); // 获取ip归属地
      let {addr, pro, city,} = region;
      const arr = ['香港', '澳门',];
      if (pro && !arr.includes(pro) && !pro.includes('市') && !pro.includes('省')) {
        pro = pro + '省';
      }
      await ctx.model.Statistics.create({
        visitIp,
        'browserName': Browser.name || 'Edge',
        systemName,
        'cityName': city,
        'province': pro,
        'address': addr,
        createTime,
      });
      // 更新城市访客数
      await ctx.model.update('UPDATE city \n' +
        'SET n = IFNULL( n, 0 ) + 1 \n' +
        'WHERE\n' +
        '\tcityName = $cityName', {'bind': {'cityName': city,}, 'type': QueryTypes.UPDATE,});
      // 更新省份访客数
      if (pro) {
        await ctx.model.update('UPDATE city \n' +
          'SET n = IFNULL( n, 0 ) + 1 \n' +
          'WHERE\n' +
          '\tcityName = $cityName', {'bind': {'cityName': pro,}, 'type': QueryTypes.UPDATE,});
      }
    }
  }
}

module.exports = WebService;
