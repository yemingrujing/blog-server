'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('images', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'imageTitle': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'imageDir': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
      'imageUrl': {
        'type': DataTypes.STRING(1024),
        'allowNull': true,
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '1',
      },
      'remark': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'images',
    });

  Model.associate = function () {

  };

  return Model;
};

