'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  permission(menus, permission) {
    const api = [], // 用户有权访问的接口
      roles = []; // 用户有权访问的菜单id
    let permissions = []; // 用户有权访问的菜单id
    menus.sort((a, b) => b.menuType - a.menuType);
    menus.map(item => {
      if (permission.includes(item.roleKey)) {
        if (item.url) {
          api.push(item.url);
        }
        permissions.push(item.id);
      }
      return item.id;
    });
    this.ctx.session.permission = api;
    permissions = Array.from(new Set(permissions));
    permissions.map(id => {
      const targetRoute = menus.filter(item => id === item.id)[0];
      roles.push({
        'url': targetRoute.url,
        'title': targetRoute.menuName,
        'rKey': targetRoute.roleKey,
        'mKey': targetRoute.menuKey,
        'icon': targetRoute.icon,
        'sort': targetRoute.sort,
        'parentId': targetRoute.pMenuId,
        'type': targetRoute.menuType,
        'id': targetRoute.id,
      });
      return targetRoute.id;
    });
    return roles;
  }
}

module.exports = UserService;
