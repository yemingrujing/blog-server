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
    if (ctx.request.body.captcha.toLocaleLowerCase() !== ctx.session.captcha) {
      this.error('验证码错误', []);
      return;
    }
    const userInfo = await service.middle.user.login(username, password),
      token = app.jwt.sign({'username': username,}, app.config.jwt.secret, {'expiresIn': '1h',});
    ctx.session.roleId = userInfo.roleId;
    ctx.session.userId = userInfo.id;
    ctx.session.username = username;
    ctx.session.captcha = '';
    this.success({
      'id': userInfo.id,
      token,
      'account': userInfo.userName,
      'avatar': userInfo.avatar,
      'theme': userInfo.theme,
      'nickName': userInfo.nickName,
      'userEmail': userInfo.userEmail,
      'remark': userInfo.remark,
    }, '登录');
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

  async logout() {
    this.ctx.session = null;
    this.success('注销成功', '注销');
  }

  async setAvator() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.middle.user.setAvator(param);
    this.success(result, '修改头像');
  }

  async changePassword() {
    const {ctx, service,} = this,
      param = {...ctx.request.body,},
      result = await service.middle.user.changePassword(param);
    this.success(result, '修改密码');
  }
}

module.exports = UserController;
