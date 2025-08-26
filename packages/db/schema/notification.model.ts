import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { member } from "./member.model";
import { organization } from "./organization.model";
import { post } from "./post.model";

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  recipientId: uuid("recipient_member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),

  senderId: uuid("sender_member_id").references(() => member.id, {
    onDelete: "cascade",
  }),

  postId: uuid("post_id").references(() => post.id, { onDelete: "cascade" }),

  type: varchar("type", {
    enum: ["organization_created", "scheduled_post_published"],
  }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  organization: one(organization, {
    fields: [notification.organizationId],
    references: [organization.id],
  }),
  post: one(post, {
    fields: [notification.postId],
    references: [post.id],
  }),
}));
