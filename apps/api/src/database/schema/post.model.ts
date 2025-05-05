import { jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";
import { user } from "./user.model";

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  publishedBy: uuid("published_by").references(() => user.id, { onDelete: "cascade" }),

  status: varchar("status", { enum: ["draft", "scheduled", "published"] })
    .default("draft")
    .notNull(),
  title: text("title").notNull(),
  content: jsonb("content").$type<Record<string, unknown>>().default({}).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
