import { S3Client } from "@aws-sdk/client-s3";
import config from "./config";
const isLocal = config.NODE_ENV === "development";
export const s3 = new S3Client({
  ...(isLocal && { endpoint: "http://localhost:4566", forcePathStyle: true }),
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});