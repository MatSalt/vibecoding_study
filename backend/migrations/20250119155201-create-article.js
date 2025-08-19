module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
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

    // Add index for slug for faster queries
    await queryInterface.addIndex('Articles', ['slug']);
    // Add index for author_id for faster queries
    await queryInterface.addIndex('Articles', ['author_id']);
    // Add index for createdAt for ordering
    await queryInterface.addIndex('Articles', ['createdAt']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Articles');
  },
};
