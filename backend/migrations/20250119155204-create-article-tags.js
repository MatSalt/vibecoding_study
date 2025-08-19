module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ArticleTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint to prevent duplicate article-tag pairs
    await queryInterface.addIndex('ArticleTags', ['article_id', 'tag_id'], {
      unique: true,
      name: 'unique_article_tag'
    });
    
    // Add individual indexes for faster queries
    await queryInterface.addIndex('ArticleTags', ['article_id']);
    await queryInterface.addIndex('ArticleTags', ['tag_id']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ArticleTags');
  },
};
