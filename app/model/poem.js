/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('poem', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'content': {
        'type': DataTypes.STRING(1024),
        'allowNull': false,
      },
      'typeName': {
        'type': DataTypes.STRING(100),
        'allowNull': false,
      },
      'author': {
        'type': DataTypes.STRING(5),
        'allowNull': false,
        'defaultValue': 'a',
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'poem',
    });

  Model.associate = function () {

  };

  return Model;
};
