'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Carts', // must match Cart table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      variantId: {
        type: Sequelize.INTEGER,
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

    // Composite unique index (cartId + variantId)
    await queryInterface.addConstraint('CartItems', {
      fields: ['cartId', 'variantId'],
      type: 'unique',
      name: 'unique_cart_variant',
    });

    // Index for variantId (for faster queries)
    await queryInterface.addIndex('CartItems', ['variantId'], {
      name: 'idx_variant_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
  },
};