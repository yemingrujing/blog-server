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
    // if (ctx.request.body.captcha.toLocaleLowerCase() !== ctx.session.captcha) {
    //   this.error('验证码错误', []);
    //   return;
    // }
    const userInfo = await service.middle.user.login(username, password),
      token = app.jwt.sign({'username': username,}, app.config.jwt.secret, {'expiresIn': '1h',});
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
      captcha = await service.util.tool.captcha();
    ctx.response.type = 'image/svg+xml';
    this.success(captcha.data, '获取验证码');
  }
}

module.exports = UserController;
