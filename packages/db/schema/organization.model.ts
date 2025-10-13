import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const organization = pgTable("organization", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  websiteUrl: text("website_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
