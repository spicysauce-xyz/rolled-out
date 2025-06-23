import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { post } from "./post.model";
import { tag } from "./tag.model";

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
