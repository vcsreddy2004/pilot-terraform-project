import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Attributes
interface OtpAttributes {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Creation Attributes
interface OtpCreationAttributes
  extends Optional<OtpAttributes, "id" | "isUsed"> {}

// 3. Model Class
class Otp
  extends Model<OtpAttributes, OtpCreationAttributes>
  implements OtpAttributes
{
  public id!: string;
  public email!: string;
  public otp!: string;
  public expiresAt!: Date;
  public isUsed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Init
Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Otp",
    tableName: "Otps",
    timestamps: true,

    indexes: [
      {
        fields: ["email"],
      },
    ],
  }
);

export default Otp;