import { NextResponse } from "next/server";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

// Azure Storage account credentials - Use environment variables
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "blog-images";

// Create shared key credential
const getSharedKeyCredential = () => {
  if (!accountName || !accountKey) {
    throw new Error("Azure Storage credentials are missing");
  }
  return new StorageSharedKeyCredential(accountName, accountKey);
};

// Create blob service client
const getBlobServiceClient = () => {
  const sharedKeyCredential = getSharedKeyCredential();
  return new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
};

// Azure best practice: Ensure container exists with proper access level
const ensureContainer = async (containerClient) => {
  try {
    // Create container if it doesn't exist with blob access level
    await containerClient.createIfNotExists({
      access: "blob", // Makes blobs public but container private
    });
    return true;
  } catch (error) {
    console.error("Error creating/checking container:", error.message);
    return false;
  }
};

// Azure best practice: Convert metadata object to valid Azure metadata format
// All metadata values must be strings for Azure Blob Storage
const formatMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object") return {};

  const formattedMetadata = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Skip null or undefined values
    if (value == null) continue;

    // Convert all values to strings (Azure requirement)
    formattedMetadata[key] = String(value);
  }

  return formattedMetadata;
};

export async function POST(request) {
  try {
    // Validate Azure Storage configuration
    if (!accountName || !accountKey) {
      return NextResponse.json(
        { error: "Azure Storage configuration is missing" },
        { status: 500 }
      );
    }

    // Initialize client
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    const containerExists = await ensureContainer(containerClient);
    if (!containerExists) {
      return NextResponse.json(
        { error: "Failed to create or access storage container" },
        { status: 500 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get file details with fallbacks for safety
    const buffer = await file.arrayBuffer();
    const fileName =
      formData.get("fileName") ||
      `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const contentType =
      formData.get("contentType") || file.type || "application/octet-stream";

    // Parse metadata if provided
    let metadata = {};
    try {
      const metadataString = formData.get("metadata");
      if (metadataString) {
        metadata = JSON.parse(metadataString);
      }
    } catch (error) {
      console.warn("Error parsing metadata:", error);
      // Continue without custom metadata if parsing fails
    }

    // Azure best practice: Organize blobs hierarchically
    // Default folder structure: year/month/filename if not specified
    let blobPath = fileName;
    if (!fileName.includes("/")) {
      const now = new Date();
      blobPath = `${now.getFullYear()}/${now.getMonth() + 1}/${fileName}`;
    }

    // Create blob client
    let blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    // Azure best practice: Check if blob already exists
    const exists = await blockBlobClient.exists();
    if (exists) {
      // Add timestamp to filename to make it unique
      const timestamp = Date.now();
      const fileNameParts = fileName.split(".");
      const extension = fileNameParts.pop();
      const baseName = fileNameParts.join(".");
      blobPath = `${baseName}-${timestamp}.${extension}`;
      blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    }

    // Format metadata for Azure (all values must be strings)
    const blobMetadata = formatMetadata({
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
      fileSize: buffer.byteLength,
      contentType: contentType,
      ...metadata,
    });

    // Console log for debugging
    console.log("Uploading blob with metadata:", blobMetadata);

    // Azure best practice: Set proper content type and metadata
    const options = {
      blobHTTPHeaders: {
        blobContentType: contentType,
        blobCacheControl: "public, max-age=31536000", // Cache for 1 year
      },
      metadata: blobMetadata,
      // Azure best practice: Implement retry strategy
      retryOptions: {
        maxTries: 3,
        tryTimeoutInMs: 60000,
      },
    };

    // Upload the file with optimized settings
    await blockBlobClient.uploadData(Buffer.from(buffer), options);

    // Generate URL with CDN if available
    let imageUrl = blockBlobClient.url;

    // If using Azure CDN, replace the blob URL with CDN URL
    const cdnEndpoint = process.env.AZURE_CDN_ENDPOINT;
    if (cdnEndpoint) {
      imageUrl = imageUrl.replace(
        `https://${accountName}.blob.core.windows.net`,
        cdnEndpoint
      );
    }

    return NextResponse.json(
      {
        url: imageUrl,
        path: blobPath,
        contentType: contentType,
        size: buffer.byteLength,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Azure Blob Storage:", error);
    return NextResponse.json(
      { error: "Failed to upload image: " + error.message },
      { status: 500 }
    );
  }
}
