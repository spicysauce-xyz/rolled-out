import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization.model";
import { post } from "./post.model";

export const tag = pgTable(
  "tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),

    label: text("label").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (tag) => [unique().on(tag.organizationId, tag.label)],
);

export const postTag = pgTable(
  "post_tag",
  {
    postId: uuid("post_id")
      .references(() => post.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tag.id, { onDelete: "cascade" })
      .notNull(),
  },
  (postTag) => [primaryKey({ columns: [postTag.postId, postTag.tagId] })],
);
