const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();

const REGION = process.env.AWS_REGION || "eu-west-2"; // Update the region
const BUCKET_NAME = process.env.BUCKET_NAME || "mindcast-frontend"; // Set your bucket name in .env
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "AKIARM4ZXA2F2DOY2MEH"; // Set your access key ID in .env
const SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY ||
  "5/B7kB01Hd428Blireoi/XyyHWoWA08WZLtdmQge"; // Set your secret access key in .env

// Initialize S3 Client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
const uploadToS3 = async (file) => {
  const filePath = file.path;
  const fileStream = fs.createReadStream(filePath); // Create a readable stream for the file
  const key = `${Date.now()}-${file.originalname}`;
  // Set up the S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME, // Name of your S3 bucket
    Key: key, // Unique key for the file in S3
    Body: fileStream, // File content
    ContentType: file.mimetype || "video/mp4", // Set the file MIME type
  };
  try {
    // Upload the file
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    console.log(`File uploaded successfully.`);
    return { url: fileUrl, eTag: response.ETag };
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

module.exports = { uploadToS3 };
