import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./database.schema";

export const database = drizzle({
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  schema,
});
