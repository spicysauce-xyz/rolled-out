// biome-ignore lint/performance/noNamespaceImport: i might fix this later
import * as dbSchema from "@mono/db";
import { Config } from "@services/config";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

export const schema = dbSchema;

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});

export type DatabaseTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
