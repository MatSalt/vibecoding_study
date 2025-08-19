module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'id'
      }
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
  }, {});

  Comment.associate = function(models) {
    // Comment belongs to User (author)
    Comment.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'author'
    });
    
    // Comment belongs to Article
    Comment.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article'
    });
  };

  return Comment;
};
