import { notOk, ok } from "@api/api.utils";
import { authMiddleware } from "@auth";
import { Database, schema } from "@database";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

export const User = new Hono().patch(
  "/session/:id",
  zValidator("json", z.object({ activeOrganizationId: z.string().optional() })),
  authMiddleware({ required: true }),
  async (c) => {
    const sessionId = c.req.param("id");
    const body = c.req.valid("json");

    if (sessionId !== c.get("session").id) {
      return notOk(c, { message: "Trying to update not current session" }, 401);
    }

    if (body.activeOrganizationId) {
      const organization = await Database.query.member.findFirst({
        where: and(
          eq(schema.member.userId, c.get("user").id),
          eq(schema.member.organizationId, body.activeOrganizationId),
        ),
      });

      if (!organization) {
        return notOk(c, { message: "Not a member of this organization" }, 404);
      }

      await Database.update(schema.session)
        .set({
          activeOrganizationId: body.activeOrganizationId,
        })
        .where(eq(schema.session.id, sessionId));
    }

    return ok(c, undefined);
  },
);
