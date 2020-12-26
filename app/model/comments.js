'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('comments', {
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
      'articleId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'commentLikeCount': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'commentDate': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
      'commentContent': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'parentCommentId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
    }, {
      'tableName': 'comments',
    });

  Model.associate = function() {

  };

  return Model;
};
