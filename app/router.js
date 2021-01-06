'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller, jwt,} = app;

  // 登录
  router.get('/', controller.home.index);
  router.get('/api/user/captcha', controller.middle.user.captcha);
  router.post('/api/user/login', controller.middle.user.login);
  router.post('/api/user/userInfo', jwt, controller.middle.user.userInfo);
  router.post('/api/user/logout', jwt, controller.middle.user.logout);

  // 用户管理
  router.post('/api/users/search', jwt, controller.admin.user.search);
  router.post('/api/users/add', jwt, controller.admin.user.add);
  router.post('/api/users/roles', jwt, controller.admin.user.roles);

  // 角色管理
  router.post('/api/role/search', jwt, controller.admin.role.search);
  router.post('/api/role/add', jwt, controller.admin.role.add);
  router.get('/api/role/del/:id', jwt, controller.admin.role.delete);
  router.post('/api/role/edit', jwt, controller.admin.role.edit);
  router.post('/api/role/menu/add', jwt, controller.admin.role.addMenu);
  router.post('/api/role/menu/query', jwt, controller.admin.role.queryRoleMenu);
  router.post('/api/role/menu/del', jwt, controller.admin.role.delMenu);

  // 菜单管理
  router.post('/api/menu/search', jwt, controller.admin.menu.search);
  router.post('/api/menu/add', jwt, controller.admin.menu.add);
  router.get('/api/menu/del/:id', jwt, controller.admin.menu.delete);
  router.post('/api/menu/edit', jwt, controller.admin.menu.edit);
};
