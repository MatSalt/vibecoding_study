module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});

  User.associate = function(models) {
    // User has many Articles (as author)
    User.hasMany(models.Article, {
      foreignKey: 'author_id',
      as: 'articles'
    });
    
    // User has many Comments (as author)
    User.hasMany(models.Comment, {
      foreignKey: 'author_id',
      as: 'comments'
    });
  };

  return User;
};
