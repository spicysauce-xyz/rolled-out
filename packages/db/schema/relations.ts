import { relations } from "drizzle-orm";
import { boardTag } from "./board-tag.model";
import { board } from "./board.model";
import { editor } from "./editor.model";
import { postTag } from "./post-tag.model";
import { post } from "./post.model";
import { tag } from "./tag.model";
import { user } from "./user.model";

export const postRelations = relations(post, ({ many }) => ({
  editors: many(editor),
  tags: many(postTag),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  posts: many(postTag),
}));

export const editorRelations = relations(editor, ({ one }) => ({
  post: one(post, {
    fields: [editor.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [editor.userId],
    references: [user.id],
  }),
}));

export const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, {
    fields: [postTag.postId],
    references: [post.id],
  }),
  tag: one(tag, {
    fields: [postTag.tagId],
    references: [tag.id],
  }),
}));

export const boardRelations = relations(board, ({ many }) => ({
  tags: many(boardTag),
}));

export const boardTagRelations = relations(boardTag, ({ one }) => ({
  board: one(board, {
    fields: [boardTag.boardId],
    references: [board.id],
  }),
  tag: one(tag, {
    fields: [boardTag.tagId],
    references: [tag.id],
  }),
}));
