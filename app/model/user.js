/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('user', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'userIp': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'userName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'userPassword': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'roleId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'userEmail': {
        'type': DataTypes.STRING(30),
        'allowNull': false,
      },
      'avatar': {
        'type': DataTypes.STRING(255),
        'allowNull': false,
      },
      'userRegistTime': {
        'type': DataTypes.DATE,
        'allowNull': true,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'userBirthday': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
      'userAge': {
        'type': DataTypes.INTEGER,
        'allowNull': true,
      },
      'userTelephoneNumber': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'nickName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'theme': {
        'type': DataTypes.STRING(255),
        'allowNull': false,
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'updateTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'remark': {
        'type': DataTypes.STRING(255),
        'allowNull': true,
      },
    }, {
      'tableName': 'user',
    });

  Model.associate = function () {

  };

  return Model;
};
