import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../config/database"; 

// 🔹 Attributes
interface RefreshTokenAttributes {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 🔹 Creation attributes (optional fields)
interface RefreshTokenCreationAttributes
  extends Optional<
    RefreshTokenAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

// 🔹 Model class
class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: string;
  public email!: string;
  public token!: string;
  public expiresAt!: Date;
  public ipAddress?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 🔹 Init model
RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "RefreshTokens",
    timestamps: true,
  }
);

export default RefreshToken;