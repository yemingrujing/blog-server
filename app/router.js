'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, } = app;

  // 登录
  router.get('/', controller.home.index);
  router.get('/api/user/captcha', controller.middle.user.captcha);
  router.post('/api/user/login', controller.middle.user.login);

  // 用户管理
  router.post('/api/user/search', controller.admin.user.search);
  router.post('/api/user/add', controller.admin.user.add);

  // 角色管理
  router.post('/api/role/search', controller.admin.role.search);
  router.post('/api/role/add', controller.admin.role.add);
  router.post('/api/role/del', controller.admin.role.delete);
  router.post('/api/role/edit', controller.admin.role.edit);
  router.post('/api/role/menu/add', controller.admin.role.addMenu);
  router.post('/api/role/menu/query', controller.admin.role.queryRoleMenu);
  router.post('/api/role/menu/del', controller.admin.role.delMenu);

  // 菜单管理
  router.post('/api/menu/search', controller.admin.menu.search);
  router.post('/api/menu/add', controller.admin.menu.add);
  router.post('/api/menu/del', controller.admin.menu.delete);
  router.post('/api/menu/edit', controller.admin.menu.edit);
};
