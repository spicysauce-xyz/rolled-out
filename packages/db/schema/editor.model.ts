import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { member } from "./member.model";
import { post } from "./post.model";

export const editor = pgTable(
  "editor",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => post.id, { onDelete: "cascade" })
      .notNull(),
    memberId: uuid("member_id")
      .references(() => member.id, { onDelete: "cascade" })
      .notNull(),

    role: varchar("role", {
      enum: ["creator", "editor"],
    })
      .notNull()
      .default("editor"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.postId, table.memberId)]
);
