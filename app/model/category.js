/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('category', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'categoryName': {
        'type': DataTypes.STRING(50),
        'allowNull': false,
      },
      'categoryAlias': {
        'type': DataTypes.STRING(15),
        'allowNull': false,
      },
      'categoryDescription': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      'tableName': 'category',
    });

  Model.associate = function () {

  };

  return Model;
};
