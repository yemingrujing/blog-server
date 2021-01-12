'use strict';

const moment = require('moment');

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
        'type': DataTypes.STRING(100),
        'allowNull': false,
      },
      'articleDes': {
        'type': DataTypes.STRING(255),
        'allowNull': false,
      },
      'keywords': {
        'type': DataTypes.STRING(100),
        'allowNull': false,
      },
      'articleContent': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'articleViews': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': () => {
          return '0';
        },
      },
      'articleCommentCount': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': () => {
          return '0';
        },
      },
      'articleDate': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
      'updateTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': () => {
          return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        },
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
        'defaultValue': () => {
          return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      'tic': {
        'type': DataTypes.SMALLINT,
        'allowNull': false,
        'defaultValue': () => {
          return '0';
        },
      },
    }, {
      'tableName': 'articles',
    });

  Model.associate = function() {

  };

  return Model;
};
