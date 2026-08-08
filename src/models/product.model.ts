import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import ProductImage from "./productImage.model";
import ProductVariants from "./productVariant.model";
// 1. Attributes
interface ProductAttributes {
  id: number;
  name: string;
  basePrice: number;
  slug: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes
interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "description"> {}

// 3. Model Class
class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public basePrice!: number;
  public slug!: string;
  public description!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  images: ProductImage[];
  variants: ProductVariants[];
}

// 4. Init
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "Products",
    timestamps: true,
  }
);

export default Product;