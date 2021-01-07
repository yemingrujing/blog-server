'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('menu', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'menuType': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'menuKey': {
        'type': DataTypes.STRING(100),
        'allowNull': false,
      },
      'pMenuId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'menuName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'url': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'pageUrl': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'icon': {
        'type': DataTypes.STRING(255),
        'allowNull': true,
      },
      'sort': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '1',
      },
      'remark': {
        'type': DataTypes.STRING(255),
        'allowNull': false,
      },
    }, {
      'tableName': 'menu',
    });

  Model.associate = function () {

  };

  return Model;
};
