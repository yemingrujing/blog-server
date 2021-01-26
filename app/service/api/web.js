'use strict';

const Service = require('egg').Service;
const parser = require('ua-parser-js');
const axios = require('axios');
const iconv = require('iconv-lite');

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
    let poem = poems[parseInt(Math.random() * (poems.length - 1), 10)];
    poem = poem.content + ' _by_ ' + poem.author;
    const fullPage = this.ctx.helper.cover();
    return {'category': categories, articles, tags, fullPage, poem, notice,};
  }

  async comment() {
    const {ctx,} = this,
      param = {...ctx.request.body,},
      device = parser(ctx.request.header['user-agent']),
      Browser = device.browser,
      Os = device.os;
    param.browserName = Browser.name + ' ' + Browser.version;
    param.systemName = Os.name + ' ' + Os.version;
    return param;
  }

  async statistics() {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize'),
      visitUrl = ctx.url,
      visitIp = ctx.request.header['x-real-ip'] || '127.0.0.1';
    ctx.logger.info(`ctx：${JSON.stringify(ctx)}`);
    await ctx.model.query('UPDATE system_config \n' +
      'SET configContent = IFNULL( configContent, 0 ) + 1 \n' +
      'WHERE\n' +
      '\tsignKey = \'visitors\'', {'type': QueryTypes.UPDATE,});
    if (!ctx.session.ip) {
      ctx.session.ip = visitIp;
      const device = parser(ctx.request.header['user-agent']),
        Browser = device.browser,
        Os = device.os,
        systemName = (Os.name || 'Windows 10') + ' ' + (Os.version || ''),
        createTime = await ctx.helper.getNowTime(),
        region = await this.getRegion(visitIp); // 获取ip归属地
      let {addr, pro, city,} = region;
      const arr = ['香港', '澳门',];
      if (pro && !arr.includes(pro) && !pro.includes('市') && !pro.includes('省')) {
        pro = pro + '省';
      }
      await ctx.model.Statistics.create({
        visitUrl,
        visitIp,
        'browserName': Browser.name || 'Edge',
        systemName,
        'cityName': city,
        'province': pro,
        'address': addr,
        createTime,
      });
      // 更新城市访客数
      await ctx.model.query('UPDATE city \n' +
        'SET n = IFNULL( n, 0 ) + 1 \n' +
        'WHERE\n' +
        '\tcityName = $cityName', {'bind': {'cityName': city,}, 'type': QueryTypes.UPDATE,});
      // 更新省份访客数
      if (pro) {
        await ctx.model.query('UPDATE city \n' +
          'SET n = IFNULL( n, 0 ) + 1 \n' +
          'WHERE\n' +
          '\tcityName = $cityName', {'bind': {'cityName': pro,}, 'type': QueryTypes.UPDATE,});
      }
    }
  }

  async getRegion(ip) { // 获取ip归属地
    ip = '114.84.150.236';
    return await axios.get(`http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, {'responseType': 'arraybuffer',})
      .then(response => {
        const str = iconv.decode(Buffer.from(response.data), 'gb2312'), // arraybuffer解码
          html = iconv.encode(str, 'utf8').toString(), // 转字符串
          reg = /\{.*?\}/gi; // 截取json
        return JSON.parse(html.match(reg)[0]);
      })
      .catch(() => {
        return {'addr': '', 'pro': '', 'city': '',};
      });
  }

}

module.exports = WebService;
