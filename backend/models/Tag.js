module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {});

  Tag.associate = function(models) {
    // Tag belongs to many Articles through ArticleTags
    Tag.belongsToMany(models.Article, {
      through: 'ArticleTags',
      foreignKey: 'tag_id',
      as: 'articles'
    });
  };

  return Tag;
};
