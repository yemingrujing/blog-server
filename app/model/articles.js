/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize,

    Model = app.model.define('articles', {
      'id': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'primaryKey': true,
      },
      'userId': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
      },
      'articleTitle': {
        'type': DataTypes.STRING(100),
        'allowNull': false,
      },
      'articleDes': {
        'type': DataTypes.STRING(255),
        'allowNull': true,
      },
      'keywords': {
        'type': DataTypes.STRING(100),
        'allowNull': true,
      },
      'articleContent': {
        'type': DataTypes.TEXT,
        'allowNull': false,
      },
      'articleViews': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'articleCommentCount': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'articleDate': {
        'type': DataTypes.DATE,
        'allowNull': true,
      },
      'updateTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'status': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
      'cover': {
        'type': DataTypes.STRING(255),
        'allowNull': true,
      },
      'createTime': {
        'type': DataTypes.DATE,
        'allowNull': false,
        'defaultValue': sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'tic': {
        'type': DataTypes.INTEGER,
        'allowNull': false,
        'defaultValue': '0',
      },
    }, {
      'tableName': 'articles',
    });

  Model.associate = function () {

  };

  return Model;
};
