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
      'pMenuId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'menuName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'url': {
        'type': DataTypes.STRING(15),
        'allowNull': false,
      },
    }, {
      'tableName': 'menu',
    });

  Model.associate = function() {

  };

  return Model;
};
