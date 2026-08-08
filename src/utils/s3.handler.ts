import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/S3"; // your client
import config from "../config/config";
export const uploadToS3 = async (file: Express.Multer.File,key:string) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return key;
};
export const deleteFromS3 = async (key:string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: key,
    })
  )
}
export const getImageUrl = (key: string) => {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:4566/${config.AWS_BUCKET_NAME}/${key}`;
  }

  return `https://${config.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
};
export const sanitizeName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "_")         .replace(/[^a-z0-9_]/g, "");    
};
export const getFileExtension = (filename: string) => {
  return filename.split(".").pop();
};