'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('statistics', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'visitUrl': {
        'type': DataTypes.STRING(200),
        'allowNull': false,
      },
      'visitIp': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'browserName': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
        'defaultValue': '1',
      },
      'systemName': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
      'cityName': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'province': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'address': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'statistics',
    });

  Model.associate = function () {

  };

  return Model;
};

