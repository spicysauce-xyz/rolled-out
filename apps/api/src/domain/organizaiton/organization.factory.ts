import type { schema } from "@database";
import type { auth } from "@domain/auth/auth.client";
import { createFactory } from "hono/factory";

type Env = {
  Variables: { user: typeof auth.$Infer.Session.user; member: typeof schema.member.$inferSelect };
};

export const organizationFactory = createFactory<Env>();
