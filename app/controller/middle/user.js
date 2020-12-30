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
    const userInfo = await service.middle.user.login(username, password);
    this.success(userInfo, '登录');
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
