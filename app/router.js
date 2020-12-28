'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, } = app;

  // 登录
  router.get('/', controller.home.index);
  router.get('/user/captcha', controller.middle.user.captcha);
  router.post('/user/login', controller.middle.user.login);

  // 用户管理
  router.post('/user/search', controller.admin.user.search);
  router.post('/user/add', controller.admin.user.add);

  // 角色管理
  router.post('/role/search', controller.admin.role.search);
  router.post('/role/add', controller.admin.role.add);
  router.post('/role/del', controller.admin.role.delete);
  router.post('/role/edit', controller.admin.role.edit);
};
