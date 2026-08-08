'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Optional: Explicit index (though unique already creates one)
    await queryInterface.addIndex('Carts', ['userId'], {
      unique: true,
      name: 'unique_user_cart',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  },
};