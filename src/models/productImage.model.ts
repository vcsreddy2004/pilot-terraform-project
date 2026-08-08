import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Attributes
interface ProductImageAttributes {
  id: number;
  productId: number;
  imageKey: string;
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes
interface ProductImageCreationAttributes
  extends Optional<ProductImageAttributes, "id" | "isPrimary"> {}

// 3. Model Class
class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: number;
  public productId!: number;
  public imageKey!: string;
  public isPrimary!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
ProductImage.init(
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

    imageKey: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ProductImage",
    tableName: "ProductImages",
    timestamps: true,

    indexes: [
      {
        fields: ["productId"],
      },
    ],
  }
);

export default ProductImage;