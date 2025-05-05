import { z } from "zod";

export const configSchema = z.object({
  DATABASE_PORT: z.coerce.number().positive(),
  DATABASE_HOST: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
});

const formatConfig = () => {
  const config = configSchema.parse(Bun.env);

  return {
    database: {
      port: config.DATABASE_PORT,
      host: config.DATABASE_HOST,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      name: config.DATABASE_NAME,
    },
  };
};

export const Config = formatConfig();
