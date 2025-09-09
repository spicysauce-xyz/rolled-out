import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Config } from "@services/config";
import { ResultAsync } from "neverthrow";

const client = new S3Client({
  region: "auto",
  endpoint: Config.s3.endpoint,
  credentials: {
    accessKeyId: Config.s3.accessKeyId,
    secretAccessKey: Config.s3.secretAccessKey,
  },
});

export const S3 = {
  createUploadUrl: (fileName: string) => {
    const command = new PutObjectCommand({
      Bucket: Config.s3.bucketName,
      Key: fileName,
    });

    return ResultAsync.fromPromise(
      getSignedUrl(client, command, { expiresIn: 60 }),
      (error) => new Error("Failed to create upload url", { cause: error })
    );
  },
};
