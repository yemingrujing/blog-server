/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('comments', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true,
      },
      'author': {
        'type': DataTypes.INTEGER,
        'allowNull': true,
      },
      'articleId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'email': {
        'type': DataTypes.STRING(50),
        'allowNull': true,
      },
      'nickName': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'commentContent': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'parentId': {
        'type': DataTypes.INTEGER,
        'allowNull': true,
      },
      'parentNickName': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'systemName': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'browserName': {
        'type': DataTypes.STRING(20),
        'allowNull': true,
      },
      'commentLikeCount': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': app.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '1',
      },
    }, {
      'tableName': 'comments',
    });

  Model.associate = function () {

  };

  return Model;
};
