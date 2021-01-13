/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('role', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'roleName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'roleKey': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'delFlag': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'role',
    });

  Model.associate = function () {

  };

  return Model;
};
