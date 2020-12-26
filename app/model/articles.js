'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('articles', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'userId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'articleTitle': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'articleContent': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'articleViews': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'articleCommentCount': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'articleDate': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
      'updateTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'cover': {
        'type': DataTypes.STRING(255),
        'allowNull': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
      },
      'articleDes': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
    }, {
      'tableName': 'articles',
    });

  Model.associate = function() {

  };

  return Model;
};
