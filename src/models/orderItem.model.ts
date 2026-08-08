import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Attributes
interface OrderItemAttributes {
  id: string;
  orderId: string;
  variantId: number;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes
interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id"> {}

// 3. Model Class
class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public orderId!: string;
  public variantId!: number;
  public productName!: string;
  public productImageUrl!: string;
  public price!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    productImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "OrderItems",
    timestamps: true,

    indexes: [
      {
        fields: ["orderId"],
      },
      {
        fields: ["variantId"],
      },
    ],
  }
);

export default OrderItem;