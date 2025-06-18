import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { post } from "./post.model";
import { user } from "./user.model";

export const editor = pgTable(
  "editor",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => post.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (editor) => [unique().on(editor.postId, editor.userId)],
);
