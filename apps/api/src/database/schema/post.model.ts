import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";
import { user } from "./user.model";

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  order: integer("order").default(0).notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  status: varchar("status", { enum: ["draft", "scheduled", "published"] })
    .default("draft")
    .notNull(),
  title: text("title").notNull(),
  content: jsonb("content").$type<Record<string, unknown>>().default({}).notNull(),

  createdBy: uuid("created_by")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});
