import { DataTypes } from "sequelize";
import {sequelize} from "../config/database";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true, 
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, 
      },
    },

    paymentId: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    shippingAddress: {
      type: DataTypes.TEXT,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        len: [10, 15], 
      },
    },
  },
  {
    tableName: "Orders",
    timestamps: true,

    indexes: [
      {
        fields: ["createdAt"], 
      },
    ],
  }
);

export default Order;