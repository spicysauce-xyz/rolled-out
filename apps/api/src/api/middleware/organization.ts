import { Database, schema } from "@services/db";
import { notOk } from "@utils/network";
import { and, eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import type { AuthMiddleware } from "./auth";

export type OrganizationMiddleware = {
  Variables: {
    organization: typeof schema.organization.$inferSelect;
    member: typeof schema.member.$inferSelect;
  };
};

export const organizationMiddleware = () =>
  createMiddleware<{
    Variables: OrganizationMiddleware["Variables"] &
      AuthMiddleware<true>["Variables"];
  }>(async (c, next) => {
    const user = c.get("user");
    const organizationId = c.req.param("organizationId");

    if (!(organizationId && user)) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    const organization = await Database.query.organization.findFirst({
      where: eq(schema.organization.id, organizationId),
    });

    if (!organization) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    const member = await Database.query.member.findFirst({
      where: and(
        eq(schema.member.userId, user.id),
        eq(schema.member.organizationId, organizationId)
      ),
      with: {
        organization: true,
      },
    });

    if (!member?.organization || member.organization.id !== organizationId) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    c.set("member", member);
    c.set("organization", organization);

    return next();
  });
