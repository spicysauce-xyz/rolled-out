import { Config } from "@config";
import * as schema from "@mono/db";
import { drizzle } from "drizzle-orm/node-postgres";

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});
