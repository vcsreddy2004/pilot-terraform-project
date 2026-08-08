import { Sequelize } from "sequelize";
import config from "./config";
export const sequelize = new Sequelize(
  config.DATABASE,
  config.MYSQL_USERNAME,
  config.MYSQL_PASSWORD,
  {
    host: config.HOST,
    dialect: "mysql",
    logging: config.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000, 
      idle: 10000,
    },
  }
);