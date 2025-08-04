import { Database, schema } from "@database";
import { authMiddleware } from "@domain/auth";
import { notOk, ok } from "@utils/network";
import { and, eq, gte } from "drizzle-orm";
import { Hono } from "hono";
import { ResultAsync } from "neverthrow";

export const InvitationHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .get("/", (c) => {
    const user = c.get("user");

    return ResultAsync.fromPromise(
      Database.query.invitation.findMany({
        where: and(
          eq(schema.invitation.email, user.email),
          eq(schema.invitation.status, "pending"),
          gte(schema.invitation.expiresAt, new Date())
        ),
        columns: {
          id: true,
          role: true,
          expiresAt: true,
        },
        with: {
          organization: {
            columns: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          inviter: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      }),
      () => new Error("Failed to fetch invitations")
    ).match(
      (invitations) => ok(c, invitations),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
