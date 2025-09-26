import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { Application } from "@application";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const IntegrationsRouter = new Hono<{ Variables: Variables }>()
  .get("/github", (c) => {
    const member = c.get("member");

    return Application.getGithubIntegration(member).match(
      (integration) => ok(c, integration ?? null),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .get("/github/setup-url", (c) => {
    const member = c.get("member");

    return Application.createGithubSetupUrl(member).match(
      (link) => ok(c, { link }),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .get("/github/pending-commits", (c) => {
    const member = c.get("member");

    return Application.getPendingCommits(member).match(
      (pendingCommits) => ok(c, pendingCommits),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
