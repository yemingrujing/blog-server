'use strict';

const Controller = require('../base_controller');

class UserController extends Controller {
  async search() {
    const { service, } = this,
      total = await service.sql.select('user'),
      list = await service.sql.select({'table': 'user', 'columns': ['id', 'userName', 'avatar', 'status', 'nickName', 'roleId','updateTime', 'remark',],});
    this.success({'result': {total, list,},});
  }

  async add() {
    const { service, ctx,} = this,
      param = {...ctx.request.body,};
    param.userRegistTime = service.tool.time();
    param.updateTime = service.tool.time();
    param.theme = param.theme || '#304156';
    param.avatar = param.avatar || 'https://raw.githubusercontent.com/SpectreAlan/images/master/blog/logo.png';
    const result = service.sql.insert({'table': 'user', param,});
    this.success({result, 'type': '添加',});
  }
}

module.exports = UserController;
