import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { RepositoryService } from "@domain/repository";
import { validator } from "@services/validator";
import { notOk, ok, okWithMeta } from "@utils/network";
import { Hono } from "hono";
import z from "zod";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const RepositoryRouter = new Hono<{ Variables: Variables }>()
  .get("/", (c) => {
    const organization = c.get("organization");

    return RepositoryService.getRepositories(organization).match(
      (repositories) => ok(c, repositories),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .get(
    ":repositoryId/commits",
    validator(
      "query",
      z.object({
        cursor: z.string().optional(),
      })
    ),
    (c) => {
      const { cursor } = c.req.valid("query");
      const repositoryId = c.req.param("repositoryId");
      const organization = c.get("organization");

      return RepositoryService.getCommits(
        organization,
        repositoryId,
        cursor
      ).match(
        (githubCommits) =>
          okWithMeta(c, githubCommits.data, { cursor: githubCommits.cursor }),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
