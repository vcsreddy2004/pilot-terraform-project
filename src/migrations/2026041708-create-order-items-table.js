'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Orders', // must match Orders table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      variantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      productImageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

    // Index for orderId (fast fetch of order items)
    await queryInterface.addIndex('OrderItems', ['orderId'], {
      name: 'idx_order_items_order_id',
    });

    // Index for variantId (analytics, joins)
    await queryInterface.addIndex('OrderItems', ['variantId'], {
      name: 'idx_order_items_variant_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  },
};