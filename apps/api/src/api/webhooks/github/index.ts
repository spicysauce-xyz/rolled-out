import { validate } from "@api/middleware/validate";
import { OrganizationService } from "@domain/organizaiton";
import { Webhooks } from "@octokit/webhooks";
import type { InstallationEvent, PushEvent } from "@octokit/webhooks-types";
import { Config } from "@services/config";
import type { Member } from "@services/db";
import { JWT } from "@services/jwt";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { handleInstallationCreated } from "./events/installation-created";
import { handleInstallationDeleted } from "./events/installation-deleted";
import { handlePush } from "./events/push";
import { handleSetupCompleted } from "./events/setup-completed";

const githubWebhooks = new Webhooks({
  secret: Config.github.webhookSecret,
});

export const GithubWebhooksRouter = new Hono()
  .post("/", async (c) => {
    const signature = c.req.header("x-hub-signature-256");
    const body = await c.req.text();

    if (!(signature && (await githubWebhooks.verify(body, signature)))) {
      return notOk(c, { message: "Unauthorized" }, 401);
    }

    const event = c.req.header("X-GitHub-Event");

    if (event === "installation") {
      const payload = await c.req.json<InstallationEvent>();

      if (payload.action === "created") {
        return handleInstallationCreated(payload).match(
          (repositories) => ok(c, repositories),
          (error) => notOk(c, { message: error.message }, 500)
        );
      }

      if (payload.action === "deleted") {
        return handleInstallationDeleted(payload).match(
          (integration) => ok(c, integration),
          (error) => notOk(c, { message: error.message }, 500)
        );
      }
    }

    if (event === "push") {
      const payload = await c.req.json<PushEvent>();

      return handlePush(payload).match(
        (integration) => ok(c, integration),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }

    return ok(c, undefined);
  })
  .get(
    "/setup",
    validate(
      "query",
      z.object({
        installation_id: z.number({ coerce: true }),
        setup_action: z.enum(["install"]),
        state: z.string(),
      })
    ),
    async (c) => {
      const { installation_id, setup_action, state } = c.req.valid("query");

      if (setup_action !== "install") {
        return notOk(c, { message: "Invalid setup action" }, 400);
      }

      const organizationId = await JWT.verify<{
        memberId: string;
        organizationId: string;
      }>(state)
        .map((token) => token.organizationId)
        .unwrapOr(null);

      if (!organizationId) {
        return notOk(c, { message: "Invalid state" }, 400);
      }

      const organization = await OrganizationService.getOrganizationById(
        // this is bad, but ok
        { organizationId } as Member,
        organizationId
      ).unwrapOr(null);

      if (!organization) {
        return notOk(c, { message: "Organization not found" }, 404);
      }

      return handleSetupCompleted(organization.id, installation_id).match(
        () =>
          c.redirect(
            `${Config.client.raw}/${organization.slug}/settings/integrations?github_setup_completed=true`
          ),
        () =>
          c.redirect(
            `${Config.client.raw}/${organization.slug}/settings/integrations?github_setup_completed=false`
          )
      );
    }
  );
