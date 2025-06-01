import { z } from "zod";

export const configSchema = z.object({
  SELF: z.string().optional(),
  CLIENT: z.string().optional(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(Bun.env);

  return {
    self: {
      raw: config.SELF,
      base: new URL(config.SELF || "").origin,
      port: new URL(config.SELF || "").port,
    },
    client: {
      raw: config.CLIENT,
      base: new URL(config.CLIENT || "").origin,
    },
    database: {
      url: config.DATABASE_URL,
    },
    resend: {
      apiKey: config.RESEND_API_KEY,
    },
  };
};

export const Config = formatConfig();
