'use strict';

const Controller = require('../base_controller');

class UserController extends Controller {
  async login() {
    const {ctx, service, app,} = this,
      {username, password,} = ctx.request.body,
      validator = await app.validator.validate({ 'username': 'string', 'password': 'string', 'captcha': 'string', }, ctx.request.body);
    if (validator) {
      this.error('参数错误', validator);
      return;
    }
    const param = {'table': 'user', 'columns': ['id', 'userName', 'nickName', 'roleId', 'avatar', 'theme',], 'where': {'userName': username,'userPassword': password, 'status': 0,},},
      query = await service.sql.select(param),
      result = query[0];
    if (result) {
      ctx.session.role = result.roleId;
      ctx.session.username = ctx.request.body.username;
      ctx.session.captcha = '';
      this.success({result,});
    } else {
      this.error('用户名/密码错误');
    }
  }

  async userInfo() {
    const {service, ctx,} = this,
      param = {'table': 'role', 'columns': ['roleKey',], 'where': {'id': ctx.session.role,},};
  }

  async captcha() {
    const { ctx, service, } = this,
      captcha = await service.tool.captcha();
    ctx.response.type = 'image/svg+xml';
    this.success({ 'result': captcha.data, });
  }
}

module.exports = UserController;
