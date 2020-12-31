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
    const userInfo = await service.middle.user.login(username, password),
      token = app.jwt.sign({'username': username,}, app.config.jwt.secret, {'expiresIn': 60 * 60,});
    ctx.session.roleId = userInfo.roleId;
    ctx.session.username = username;
    ctx.session.captcha = '';
    this.success(token, '登录');
  }

  async userInfo() {
    const {service,} = this,
      result = await service.middle.user.userInfo();
    this.success(result, '登录');
  }

  async captcha() {
    const {ctx, service,} = this,
      captcha = await service.tool.captcha();
    ctx.response.type = 'image/svg+xml';
    this.success({'result': captcha.data,});
  }
}

module.exports = UserController;
