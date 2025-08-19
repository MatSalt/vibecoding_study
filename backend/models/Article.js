module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
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

  Article.associate = function(models) {
    // Article belongs to User (author)
    Article.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'author'
    });
    
    // Article has many Comments
    Article.hasMany(models.Comment, {
      foreignKey: 'article_id',
      as: 'comments',
      onDelete: 'CASCADE'
    });
    
    // Article belongs to many Tags through ArticleTags
    Article.belongsToMany(models.Tag, {
      through: 'ArticleTags',
      foreignKey: 'article_id',
      as: 'tags'
    });
  };

  return Article;
};
