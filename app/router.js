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
  router.post('/api/users/edit', jwt, controller.admin.user.edit);
  router.post('/api/users/roles', jwt, controller.admin.user.roles);
  router.post('/api/users/onOff', jwt, controller.admin.user.onOff);
  router.post('/api/users/del', jwt, controller.admin.user.del);

  // 角色管理
  router.post('/api/role/search', jwt, controller.admin.role.search);
  router.post('/api/role/add', jwt, controller.admin.role.add);
  router.post('/api/role/del', jwt, controller.admin.role.delete);
  router.post('/api/role/edit', jwt, controller.admin.role.edit);

  // 分类管理
  router.post('/api/category/search', jwt, controller.blog.category.search);
  router.post('/api/category/add', jwt, controller.blog.category.add);
  router.post('/api/category/del', jwt, controller.blog.category.delete);
  router.post('/api/category/edit', jwt, controller.blog.category.edit);
  router.post('/api/category/artSearch', jwt, controller.blog.category.artSearch);
  router.post('/api/category/belong', jwt, controller.blog.category.belong);

  // 标签管理
  router.post('/api/tag/search', jwt, controller.blog.tag.search);
  router.post('/api/tag/add', jwt, controller.blog.tag.add);
  router.post('/api/tag/del', jwt, controller.blog.tag.delete);
  router.post('/api/tag/edit', jwt, controller.blog.tag.edit);
  router.post('/api/tag/artSearch', jwt, controller.blog.tag.artSearch);
  router.post('/api/tag/belong', jwt, controller.blog.tag.belong);

  // 菜单管理
  router.post('/api/menu/search', jwt, controller.admin.menu.search);
  router.post('/api/menu/add', jwt, controller.admin.menu.add);
  router.post('/api/menu/del', jwt, controller.admin.menu.delete);
  router.post('/api/menu/edit', jwt, controller.admin.menu.edit);

  // 博客管理
  router.post('/api/articles/search', jwt, controller.blog.articles.search);
  router.post('/api/articles/add', jwt, controller.blog.articles.add);
};
