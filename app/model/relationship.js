'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('relationship', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'roleKey': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
        'primaryKey': true,
      },
      'menuId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
    }, {
      'tableName': 'relationship',
    });

  Model.associate = function() {

  };

  return Model;
};
