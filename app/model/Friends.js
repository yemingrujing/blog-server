/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('Friends', {
      'userId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'userName': {
        'type': DataTypes.STRING(20),
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
    }, {
      'tableName': 'Friends',
    });

  Model.associate = function () {

  };

  return Model;
};
