import { Database } from "@database";
import { authMiddleware } from "@domain/auth";
import { member } from "@mono/db";
import { notOk, ok } from "@utils/network";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { ResultAsync } from "neverthrow";

export const OrganizationHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .get("/", (c) => {
    const user = c.get("user");

    return ResultAsync.fromPromise(
      Database.query.member.findMany({
        where: eq(member.userId, user.id),
        orderBy: [asc(member.createdAt)],
        columns: {
          role: true,
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
        },
      }),
      () => new Error("Failed to fetch organizations")
    )
      .map((memberships) => {
        return memberships.map((membership) => ({
          id: membership.organization.id,
          name: membership.organization.name,
          slug: membership.organization.slug ?? "",
          logo: membership.organization.logo,
          role: membership.role,
        }));
      })
      .match(
        (organizations) => ok(c, organizations),
        (error) => notOk(c, { message: error.message }, 500)
      );
  });
