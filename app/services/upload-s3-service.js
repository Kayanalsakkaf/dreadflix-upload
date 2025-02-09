const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();
const AWS = require("aws-sdk");

const REGION = process.env.AWS_REGION; // Update the region
const BUCKET_NAME = process.env.BUCKET_NAME; // Set your bucket name in .env
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; // Set your access key ID in .env
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY; // Set your secret access key in .env

// AWS S3 Configuration using Access Key
const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION, // Change to your bucket's region
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
    const response = await s3.upload(params).promise();
    //  const response = await s3Client.send(command);
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    console.log(`File uploaded successfully.`);
    return { url: fileUrl, eTag: response.ETag };
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

module.exports = { uploadToS3 };