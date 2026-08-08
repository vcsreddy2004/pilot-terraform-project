'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
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

      size: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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

    // Unique constraint (productId + size)
    await queryInterface.addConstraint('ProductVariants', {
      fields: ['productId', 'size'],
      type: 'unique',
      name: 'unique_product_size',
    });

    // Index for faster product queries
    await queryInterface.addIndex('ProductVariants', ['productId'], {
      name: 'idx_product_variants_product_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductVariants');
  },
};  