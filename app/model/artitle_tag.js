'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('artitle_tag', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'artId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'tagId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
      },
    }, {
      'tableName': 'artitle_tag',
    });

  Model.associate = function () {

  };

  return Model;
};
