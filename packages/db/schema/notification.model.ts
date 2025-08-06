import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";
import { user } from "./user.model";

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  senderId: uuid("sender_id").references(() => user.id, {
    onDelete: "cascade",
  }),

  type: varchar("type", { enum: ["organization_created"] }).notNull(),

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
}));
