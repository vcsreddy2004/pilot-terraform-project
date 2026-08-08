import { DataTypes } from "sequelize";
import {sequelize} from "../config/database";

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "ProductVariants",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["productId", "size"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export default ProductVariant;