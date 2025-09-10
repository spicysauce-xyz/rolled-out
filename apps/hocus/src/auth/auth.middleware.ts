import { Database, schema } from "@database";
import { and, eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { auth } from "./auth.client";

type AuthMiddleware = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
    member: typeof schema.member.$inferSelect;
  };
};

export const authMiddleware = () => {
  return createMiddleware<AuthMiddleware>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json(
        {
          success: false,
          error: { message: "Unauthorized", code: "UNAUTHORIZED" },
        },
        401
      );
    }

    const organizationId = c.req.param("organizationId");

    if (!organizationId) {
      return c.json(
        {
          success: false,
          error: {
            message: "Organization ID is required",
            code: "BAD_REQUEST",
          },
        },
        400
      );
    }

    const member = await Database.query.member.findFirst({
      where: and(
        eq(schema.member.userId, session.user.id),
        eq(schema.member.organizationId, organizationId)
      ),
    });

    if (!member) {
      return c.json(
        {
          success: false,
          error: { message: "Member not found", code: "NOT_FOUND" },
        },
        404
      );
    }

    c.set("user", session.user);
    c.set("session", session.session);
    c.set("member", member);
    return next();
  });
};
