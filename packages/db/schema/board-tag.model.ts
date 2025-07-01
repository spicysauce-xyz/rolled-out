import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { board } from "./board.model";
import { tag } from "./tag.model";

export const boardTag = pgTable(
  "board_tag",
  {
    boardId: uuid("board_id")
      .references(() => board.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tag.id, { onDelete: "cascade" })
      .notNull(),
  },
  (boardTag) => [primaryKey({ columns: [boardTag.boardId, boardTag.tagId] })],
);
