'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('system_config', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'configTitle': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'signKey': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'configContent': {
        'type': DataTypes.STRING(300),
        'allowNull': false,
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
    }, {
      'tableName': 'system_config',
    });

  Model.associate = function () {

  };

  return Model;
};
