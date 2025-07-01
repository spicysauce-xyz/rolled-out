import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";

export const board = pgTable(
  "board",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),

    slug: text("slug").notNull(),
    name: text("name").notNull().default("Untitled Board"),
    symbol: text("symbol").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique("board_slug_unique").on(table.slug)],
);
