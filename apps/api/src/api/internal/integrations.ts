import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { Github } from "@services/github";
import { validator } from "@services/validator";
import { okWithMeta } from "@utils/network";
import { Hono } from "hono";
import z from "zod";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

const INSTALLATION_ID = 85_766_599;

export const IntegrationsRouter = new Hono<{ Variables: Variables }>().get(
  "/github",
  validator(
    "query",
    z.object({
      cursor: z.string().optional(),
    })
  ),
  async (c) => {
    const { cursor } = c.req.valid("query");

    const githubCommits = await Github.getCommits(
      INSTALLATION_ID,
      {
        owner: "kulgavy",
        repo: "changelog",
        ref: "main",
      },
      { cursor }
    );

    return okWithMeta(c, githubCommits.data, { cursor: githubCommits.cursor });
  }
);
