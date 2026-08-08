'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // must match Products table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      imageKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      isPrimary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // Index for faster product image queries
    await queryInterface.addIndex('ProductImages', ['productId'], {
      name: 'idx_product_images_product_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductImages');
  },
};