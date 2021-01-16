'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('city', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'cityName': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
      'x': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
      'y': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
        'defaultValue': '1',
      },
      'n': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
    }, {
      'tableName': 'city',
    });

  Model.associate = function () {

  };

  return Model;
};

