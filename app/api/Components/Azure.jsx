import { BlobServiceClient } from "@azure/storage-blob";

export async function uploadToAzure(file, fileName) {
  try {
    // Enhanced debugging
    console.log("Starting Azure upload process for:", fileName);
    console.log("File object type:", typeof file);
    console.log("File size:", file.size);

    // Get connection string from environment variables
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    // Use consistent container name across functions
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME || "projects";

    if (!connectionString) {
      console.error(
        "Azure Storage connection string is missing in environment variables"
      );
      throw new Error("Azure Storage connection string is missing");
    }

    // Create blob service client with improved error handling
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container if it doesn't exist
    console.log("Ensuring container exists:", containerName);
    await containerClient.createIfNotExists({
      access: "blob", // Public access at blob level
    });

    // Generate unique blob name to avoid overwrites
    const uniqueName = `${Date.now()}-${fileName.replace(/[^\w.-]/g, "")}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

    // Convert File to buffer if needed with better error handling
    let buffer;
    let contentType;

    try {
      if (file instanceof Buffer) {
        buffer = file;
        contentType = "application/octet-stream";
      } else {
        buffer = Buffer.from(await file.arrayBuffer());
        contentType = file.type || "application/octet-stream";

        // Better content type detection for common image types
        if (!file.type && fileName) {
          const extension = fileName.split(".").pop().toLowerCase();
          const imageTypes = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
          };
          contentType = imageTypes[extension] || contentType;
        }
      }
    } catch (bufferError) {
      console.error("Error creating buffer from file:", bufferError);
      throw new Error(`Failed to process file: ${bufferError.message}`);
    }

    // Upload with improved options
    console.log("Uploading blob to Azure...");
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
        blobCacheControl: "max-age=86400", // 1 day cache
      },
      metadata: {
        filename: fileName,
        uploadDate: new Date().toISOString(),
      },
    });

    console.log("File uploaded to Azure Blob Storage:", blockBlobClient.url);

    return {
      success: true,
      url: blockBlobClient.url,
      name: uniqueName,
    };
  } catch (error) {
    console.error("Azure upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Use same container name for consistency as in uploadToAzure
export async function deleteFromAzure(blobName) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    // Use same container name as upload function
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME || "portfolio";

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
    console.log("Successfully deleted blob:", blobName);

    return { success: true };
  } catch (error) {
    console.error("Azure delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Helper function to extract blob name from URL (helpful for deletions)
export function getBlobNameFromUrl(url) {
  if (!url) return null;
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
}
