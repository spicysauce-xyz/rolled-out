import { z } from "zod";

export const configSchema = z.object({
  DOMAIN: z.string(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(Bun.env);

  return {
    domain: config.DOMAIN,
    database: {
      url: config.DATABASE_URL,
    },
    resend: {
      apiKey: config.RESEND_API_KEY,
    },
  };
};

export const Config = formatConfig();
