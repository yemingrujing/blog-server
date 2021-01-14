'use strict';

const Service = require('egg').Service;

class SystemConfigService extends Service {

  async search() {
    const {ctx,} = this;
    return await ctx.model.SystemConfig.findAll({
      'attributes': ['id', 'configTitle', 'signKey', 'configContent', 'remark', 'createTime',],
      'order': [['createTime', 'desc',],],
    });
  }

  async add(req) {
    const {ctx,} = this,
      {configTitle, signKey, configContent, remark,} = req,
      createTime = await ctx.helper.getNowTime(),
      systemConfig = await ctx.model.SystemConfig.create({configTitle, signKey, configContent, remark, createTime,});
    if (systemConfig) {
      return systemConfig.id;
    }
    ctx.throw(500, [999, '配置信息新增失败：' + JSON.stringify(req),]);
  }

  async edit(req) {
    const {ctx,} = this,
      {id, configTitle, signKey, configContent, remark,} = req,
      systemConfig = await ctx.model.SystemConfig.findByPk(id);
    if (!systemConfig) {
      ctx.throw(500, [999, '配置信息不存在',]);
    }
    return await systemConfig.update({configTitle, signKey, configContent, remark,});
  }

  async imageStorage() {
    // 查询图床
    const {ctx,} = this,
      systemConfig = await ctx.model.SystemConfig.findAll({'where': {'signKey': imageStorage,},});
    if (!systemConfig) {
      ctx.throw(500, [999, '请先去添加imageStorage配置信息',]);
    }
    return systemConfig[0].configContent;
  }
}

module.exports = SystemConfigService;
