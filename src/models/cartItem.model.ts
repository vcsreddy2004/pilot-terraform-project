import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../config/database";

// 1. Attributes
interface CartItemAttributes {
  id: string;
  cartId: string;
  variantId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes (id optional)
interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

// 3. Model Class
class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
  public cartId!: string;
  public variantId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "CartItem",
    tableName: "CartItems",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["cartId", "variantId"],
      },
      {
        fields: ["variantId"],
      },
    ],
  }
);

export default CartItem;