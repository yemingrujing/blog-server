'use strict';

const moment = require('moment');

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('artitle_category', {
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
      'categoryId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': () => {
          return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        },
      },
    }, {
      'tableName': 'artitle_category',
    });

  Model.associate = function() {

  };

  return Model;
};
