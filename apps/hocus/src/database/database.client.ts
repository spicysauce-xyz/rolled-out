import { Config } from "@config";
// biome-ignore lint/performance/noNamespaceImport: i might fix this later
import * as schema from "@mono/db";
import { drizzle } from "drizzle-orm/node-postgres";

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});
