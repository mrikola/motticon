import { Service } from "typedi";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Config } from "../config/config";

@Service()
export class R2StorageService {
  private s3Client: S3Client;
  private config: Config["r2"];

  constructor(config: Config) {
    this.config = config.r2;

    // Initialize S3 client for R2 (R2 is S3-compatible)
    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${this.config.accountId}.eu.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  /**
   * Constructs the full key path, prepending root directory if configured
   * @param key Base key path
   * @returns Full key path with root directory prefix if configured
   */
  private buildKey(key: string): string {
    if (this.config.rootDirectory) {
      // Remove leading/trailing slashes from root directory and key, then join
      const rootDir = this.config.rootDirectory.replace(/^\/+|\/+$/g, "");
      const cleanKey = key.replace(/^\/+/, "");
      return `${rootDir}/${cleanKey}`;
    }
    return key;
  }

  /**
   * Uploads a file to R2 storage and returns the public URL
   * @param buffer File buffer to upload
   * @param key Object key (path) in the bucket
   * @param contentType MIME type of the file
   * @returns Public URL to access the uploaded file
   */
  public async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    let fullKey: string;
    try {
      // Prepend root directory if configured
      fullKey = this.buildKey(key);

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fullKey,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      return `${this.config.publicUrl}/${fullKey}`;
    } catch (error: any) {
      // Log detailed error information for debugging
      console.error("Error uploading file to R2:", {
        error: error,
        message: error?.message,
        code: error?.Code || error?.code,
        statusCode: error?.$metadata?.httpStatusCode,
        requestId: error?.$metadata?.requestId,
        bucket: this.config.bucketName,
        key: fullKey,
        endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      });

      // Provide more detailed error message
      const errorMessage = error?.Code || error?.code || error?.message || "Unknown error";
      const statusCode = error?.$metadata?.httpStatusCode;
      throw new Error(
        `Failed to upload file to R2: ${errorMessage}${statusCode ? ` (HTTP ${statusCode})` : ""}`
      );
    }
  }
}
