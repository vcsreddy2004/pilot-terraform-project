import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Attributes
interface CartAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation attributes (id optional)
interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

// 3. Model class
class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "Carts",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  }
);

export default Cart;