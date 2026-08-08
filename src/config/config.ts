import dotenvSafe from "dotenv-safe";
import path from "path";
dotenvSafe.config({
  path: path.resolve(process.cwd(), ".env"),
  example: path.resolve(process.cwd(), ".env.example"),
});
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
const PORT:string = requireEnv(process.env.PORT,"PORT");

const ACCESS_SECRET:string = requireEnv(process.env.ACCESS_SECRET,"ACCESS_SECRET");
const REFRESH_SECRET:string = requireEnv(process.env.REFRESH_SECRET,"REFRESH_SECRET");

const MAIL_SERVICE:string = requireEnv(process.env.MAIL_SERVICE,"MAIL_SERVICE");
const MAIL_USER:string = requireEnv(process.env.MAIL_USER,"MAIL_USER");
const MAIL_PASSWORD:string  = requireEnv(process.env.MAIL_PASSWORD,"MAIL_PASSWORD");
const OTP_EXPIRY_MINUTES:string = requireEnv(process.env.OTP_EXPIRY_MINUTES,"OTP_EXPIRY_MINUTES");

const MYSQL_USERNAME:string = requireEnv(process.env.MYSQL_USERNAME, "MYSQL_USERNAME");
const MYSQL_PASSWORD:string = requireEnv(process.env.MYSQL_PASSWORD, "MYSQL_PASSWORD");
const DATABASE:string = requireEnv(process.env.DATABASE, "DATABASE");
const HOST:string = requireEnv(process.env.HOST, "HOST");

const NODE_ENV:string = requireEnv(process.env.NODE_ENV,"development");

const AWS_S3_BASE_URL:string = requireEnv(process.env.AWS_S3_BASE_URL,"AWS_S3_BASE_URL");
const AWS_REGION:string = requireEnv(process.env.AWS_REGION,"AWS_REGION");
const AWS_ACCESS_KEY:string = requireEnv(process.env.AWS_ACCESS_KEY,"AWS_ACCESS_KEY");
const AWS_SECRET_KEY:string = requireEnv(process.env.AWS_SECRET_KEY,"AWS_SECRET_KEY");
const AWS_BUCKET_NAME:string = requireEnv(process.env.AWS_BUCKET_NAME,"AWS_BUCKET_NAME");
export default {
  PORT,
  ACCESS_SECRET,
  REFRESH_SECRET,
  MAIL_SERVICE,
  MAIL_USER,
  MAIL_PASSWORD,
  OTP_EXPIRY_MINUTES,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  DATABASE,
  HOST,
  NODE_ENV,
  AWS_S3_BASE_URL,
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
};
