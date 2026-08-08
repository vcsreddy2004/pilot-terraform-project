import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";
const BUCKET_NAME = "clothing-db";
const REGION = "ap-south-1";
const s3 = new S3Client({
  region: "ap-south-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});
async function createBucket() {
  try {
    const command = new CreateBucketCommand({
      Bucket: BUCKET_NAME,
    });

    const response = await s3.send(command);
    console.log("Bucket created successfully:", response);
  } catch (error: any) {
    if (error.name === "BucketAlreadyOwnedByYou") {
      console.log("Bucket already exists (owned by you)");
    } else if (error.name === "BucketAlreadyExists") {
      console.log("Bucket name already taken globally");
    } else {
      console.error("Error creating bucket:", error);
    }
  }
}

createBucket();