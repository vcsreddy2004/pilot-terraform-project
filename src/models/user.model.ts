import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Attributes
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  tokenVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "isVerified" | "tokenVersion"> {}

// 3. Model Class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public refreshToken!: string;
  public role!: string;
  public isVerified!: boolean;
  public tokenVersion!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "customer",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,

    defaultScope: {
      attributes: { exclude: ["password"] }, 
    },
  }
);

export default User;