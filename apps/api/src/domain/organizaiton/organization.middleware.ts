import { Database, schema } from "@database";
import { notOk } from "@utils/network";
import { and, eq } from "drizzle-orm";
import { organizationFactory } from "./organization.factory";

export const organizationMiddleware = organizationFactory.createMiddleware(
  async (c, next) => {
    const user = c.get("user");
    const organizationId = c.req.param("organizationId");

    if (!(organizationId && user)) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    const member = await Database.query.member.findFirst({
      where: and(
        eq(schema.member.userId, user.id),
        eq(schema.member.organizationId, organizationId)
      ),
    });

    if (!member) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    c.set("member", member);
    return next();
  }
);
