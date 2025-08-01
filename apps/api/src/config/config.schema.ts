import { z } from "zod";

export const configSchema = z.object({
  SELF: z.string(),
  CLIENT: z.string(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_DOMAIN: z.string(),
  S3_ENDPOINT: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_ASSETS_BASE: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(process.env);

  return {
    self: {
      raw: config.SELF,
      base: new URL(config.SELF || "").origin,
      port: new URL(config.SELF || "").port,
    },
    client: {
      raw: config.CLIENT,
      base: new URL(config.CLIENT || "").origin,
      domain: new URL(config.CLIENT || "").hostname,
    },
    database: {
      url: config.DATABASE_URL,
    },
    redis: {
      url: config.REDIS_URL,
    },
    resend: {
      apiKey: config.RESEND_API_KEY,
      domain: config.RESEND_DOMAIN,
    },
    s3: {
      endpoint: config.S3_ENDPOINT,
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
      bucketName: config.S3_BUCKET_NAME,
      assetsBase: config.S3_ASSETS_BASE,
    },
  };
};

export const Config = formatConfig();
