import { z } from "zod";

export const configSchema = z.object({
  SERVER_HOST: z.string().optional(),
  SERVER_PORT: z.string({ coerce: true }).optional(),
  SERVER_PATH: z.string().optional(),
  CLIENT_HOST: z.string(),
  CLIENT_PORT: z.number({ coerce: true }).optional(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(Bun.env);

  return {
    self: {
      base: `http${config.SERVER_HOST === "localhost" ? "" : "s"}://${config.SERVER_HOST}${config.SERVER_PORT ? `:${config.SERVER_PORT}` : ""}`,
      port: config.SERVER_PORT,
    },
    client: {
      base: `http${config.CLIENT_HOST === "localhost" ? "" : "s"}://${config.CLIENT_HOST}${config.CLIENT_PORT ? `:${config.CLIENT_PORT}` : ""}`,
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
