import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity"; // Install: npm install @azure/identity

import fs from "fs";
import { Readable } from "stream";

import dotenv from "dotenv";
import { log } from "console";
dotenv.config();
const ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

export const uploadToAzureBlob = async (file) => {
  const filePath = file.path;

  try {
    const url = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${process.env.AZURE_STORAGE_SAS_TOKEN}`;

    // Create the BlobServiceClient instance using the SAS URL
    const blobServiceClient = new BlobServiceClient(url);

    const containerClient =
      blobServiceClient.getContainerClient("dreadflixcontainer");

    // Get the blob client (file to upload)
    const blockBlob = containerClient.getBlockBlobClient(file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const uploadBlobResponse = await blockBlob.upload(
      fileBuffer,
      fileBuffer.length
    );

    console.log(`Upload blob successfully`, blockBlob.url);
    return blockBlob.url;
  } catch (error) {
    console.error("Error uploading to Azure Blob:", error);
  }
};
