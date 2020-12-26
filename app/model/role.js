'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('role', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'roleName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'roleKey': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
      },
    }, {
      'tableName': 'role',
    });

  Model.associate = function() {

  };

  return Model;
};
