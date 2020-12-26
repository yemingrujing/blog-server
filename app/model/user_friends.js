'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('user_friends', {
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
      'userFriendsId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'userNote': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'userStatus': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
    }, {
      'tableName': 'user_friends',
    });

  Model.associate = function() {

  };

  return Model;
};
