import { Config } from "@config";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { type NodePgQueryResultHKT, drizzle } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});

export type DatabaseTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
