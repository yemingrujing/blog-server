'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('gallery', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'title': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'describe': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'url': {
        'type': DataTypes.STRING(1024),
        'allowNull': false,
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '1',
      },
      'remark': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'updateTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'gallery',
    });

  Model.associate = function () {

  };

  return Model;
};
