/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('tag', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'tagName': {
        'type': DataTypes.STRING(20),
        'allowNull': false,
      },
      'tagAlias': {
        'type': DataTypes.STRING(15),
        'allowNull': false,
      },
      'tagDescription': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'tag',
    });

  Model.associate = function () {

  };

  return Model;
};
