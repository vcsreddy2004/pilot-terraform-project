'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        // Optional FK (uncomment if you have Users table)
        // references: {
        //   model: 'Users',
        //   key: 'id',
        // },
        // onDelete: 'SET NULL',
        // onUpdate: 'CASCADE',
      },

      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      paymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },

      shippingAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      phoneNumber: {
        type: Sequelize.STRING,
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

    // Index for sorting/filtering by createdAt
    await queryInterface.addIndex('Orders', ['createdAt'], {
      name: 'idx_orders_created_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};