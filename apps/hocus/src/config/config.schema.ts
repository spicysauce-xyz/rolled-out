import { z } from "zod";

export const configSchema = z.object({
  SELF: z.string(),
  CLIENT: z.string(),
  DATABASE_URL: z.string(),
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
      domain: new URL(config.SELF || "").hostname,
    },
    database: {
      url: config.DATABASE_URL,
    },
  };
};

export const Config = formatConfig();
