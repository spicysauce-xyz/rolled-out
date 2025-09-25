import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { Application } from "@application";
import { notOk, ok, okWithMeta } from "@utils/network";
import { Hono } from "hono";
import z from "zod";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const RepositoryRouter = new Hono<{ Variables: Variables }>()
  .get("/", (c) => {
    const member = c.get("member");

    return Application.getRepositories(member).match(
      (repositories) => ok(c, repositories),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .get(
    ":repositoryId/commits",
    validate(
      "query",
      z.object({
        cursor: z.string().optional(),
      })
    ),
    (c) => {
      const { cursor } = c.req.valid("query");
      const repositoryId = c.req.param("repositoryId");
      const member = c.get("member");

      return Application.getRepositoryCommits(
        member,
        repositoryId,
        cursor
      ).match(
        (githubCommits) =>
          okWithMeta(c, githubCommits.data, { cursor: githubCommits.cursor }),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
