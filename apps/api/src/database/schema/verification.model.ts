import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const verification = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
