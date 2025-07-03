import { Config } from "@config";
// biome-ignore lint/performance/noNamespaceImport: i might fix this later
import * as schema from "@mono/db";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});

export type DatabaseTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
