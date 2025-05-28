import { z } from "zod";

export const configSchema = z.object({
  CLIENT_HOST: z.string(),
  CLIENT_PORT: z.number({ coerce: true }).optional(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(Bun.env);

  return {
    client: {
      url: `http${config.CLIENT_HOST === "localhost" ? "" : "s"}://${config.CLIENT_HOST}${config.CLIENT_PORT ? `:${config.CLIENT_PORT}` : ""}`,
      host: config.CLIENT_HOST,
      port: config.CLIENT_PORT,
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
