'use strict';

const Controller = require('../base_controller');

class UserController extends Controller {
  async login() {
    const {ctx, service, app,} = this,
      {username, password,} = ctx.request.body,
      validator = await app.validator.validate({
        'username': 'string',
        'password': 'string',
        'captcha': 'string',
      }, ctx.request.body);
    if (validator) {
      this.error('参数错误', validator);
      return;
    }
    const isValidUser = await service.middle.user.login(username, password);
    if (isValidUser) {
      const token = app.jwt.sign({ 'username': username, }, app.config.jwt.secret);
      this.success(token, '登录');
    }
    ctx.throw(401, '登录失败，用户名/密码错误');
  }

  async userInfo() {
    const {service, ctx,} = this,
      param = {'table': 'role', 'columns': ['roleKey',], 'where': {'id': ctx.session.role,},};
  }

  async captcha() {
    const {ctx, service,} = this,
      captcha = await service.tool.captcha();
    ctx.response.type = 'image/svg+xml';
    this.success({'result': captcha.data,});
  }
}

module.exports = UserController;
