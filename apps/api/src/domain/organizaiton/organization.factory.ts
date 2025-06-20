import type { schema } from "@database";
import type { auth } from "@domain/auth/auth.client";
import { createFactory } from "hono/factory";

export type OrganizationVariables = {
  user: typeof auth.$Infer.Session.user;
  member: typeof schema.member.$inferSelect;
};

export type OrganizationEnv = {
  Variables: OrganizationVariables;
};

export const organizationFactory = createFactory<OrganizationEnv>();
