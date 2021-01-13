/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('relationship', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'roleKey': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
        'primaryKey': true,
      },
      'menuId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': true,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'relationship',
    });

  Model.associate = function () {

  };

  return Model;
};
