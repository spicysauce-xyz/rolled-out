import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
};

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),

  ...timestamps,
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  expiresAt: timestamp("expires_at").notNull(),

  ...timestamps,
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),

  ...timestamps,
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  ...timestamps,
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  metadata: text("metadata"),

  ...timestamps,
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  role: text("role").notNull(),

  ...timestamps,
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  ...timestamps,
});
