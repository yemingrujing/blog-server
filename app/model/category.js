'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('category', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'categoryName': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'categoryAlias': {
        'type': DataTypes.STRING(15),
        'allowNull': false,
      },
      'categoryDescription': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'parentCategoryId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
    }, {
      'tableName': 'category',
    });

  Model.associate = function() {

  };

  return Model;
};
