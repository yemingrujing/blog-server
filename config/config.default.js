'use strict';

const Op = require('sequelize').Op;

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1608695222703_9411';

  // add your user config here
  const userConfig = {
    'view': {
      'defaultViewEngine': 'nunjucks',
      'mapping': {
        '.tpl': 'nunjucks',
      },
    },
    // add your middleware config here
    'middleware': [
      'errorHandler',
    ],
    'errorHandler': {
      'enable': true,
      'match': '/api',
    },
    'sequelize': {
      'dialect': 'mysql',
      'database': 'db_blog', //数据库名
      'host': '',
      'port': '3306',
      'username': '', //账号
      'password': '', //密码
      'define': { // model的全局配置
        'timestamps': false, // 添加create,update,delete时间戳
        'paranoid': true, // 添加软删除
        'freezeTableName': true, // 防止修改表名为复数
        'underscored': false, // 防止驼峰式字段被默认转为下划线
      },
      'timezone': '+8:00', // 由于orm用的UTC时间，这里必须加上东八区，否则取出来的时间相差8小时
      'dialectOptions': { // 让读取date类型数据时返回字符串而不是UTC时间
        'dateStrings': true,
        typeCast(field, next) {
          if (field.type === 'DATETIME') {
            return field.string();
          }
          return next();
        },
      },
      'operatorsAliases': { // 使用默认运算符别名
        '$eq': Op.eq,
        '$ne': Op.ne,
        '$gte': Op.gte,
        '$gt': Op.gt,
        '$lte': Op.lte,
        '$lt': Op.lt,
        '$not': Op.not,
        '$in': Op.in,
        '$notIn': Op.notIn,
        '$is': Op.is,
        '$like': Op.like,
        '$notLike': Op.notLike,
        '$iLike': Op.iLike,
        '$notILike': Op.notILike,
        '$regexp': Op.regexp,
        '$notRegexp': Op.notRegexp,
        '$iRegexp': Op.iRegexp,
        '$notIRegexp': Op.notIRegexp,
        '$between': Op.between,
        '$notBetween': Op.notBetween,
        '$overlap': Op.overlap,
        '$contains': Op.contains,
        '$contained': Op.contained,
        '$adjacent': Op.adjacent,
        '$strictLeft': Op.strictLeft,
        '$strictRight': Op.strictRight,
        '$noExtendRight': Op.noExtendRight,
        '$noExtendLeft': Op.noExtendLeft,
        '$and': Op.and,
        '$or': Op.or,
        '$any': Op.any,
        '$all': Op.all,
        '$values': Op.values,
        '$col': Op.col,
      },
    },
    'validate': {
      'convert': true,
      'widelyUndefined': true,
    },
    'security': {
      'csrf': {
        'enable': false,
        'headerName': 'x-csrf-token',// 自定义请求头
        'ignoreJSON': true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      },
      'domainWhiteList': ['*',],
    },
    'cors': {
      'origin': '*',
      'allowMethods': 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    },
    'logger': {
      'level': 'DEBUG',
      'outputJSON': true,
      'encoding': 'utf-8',
      'consoleLevel': 'DEBUG',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
