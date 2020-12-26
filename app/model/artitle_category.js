'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('artitle_category', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'categoryId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
      },
    }, {
      'tableName': 'artitle_category',
    });

  Model.associate = function() {

  };

  return Model;
};
