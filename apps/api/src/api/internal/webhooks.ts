import { validate } from "@api/middleware/validate";
import { Application } from "@application";
import { IntegrationService } from "@domain/integration";
import { Webhooks } from "@octokit/webhooks";
import type { InstallationEvent, PushEvent } from "@octokit/webhooks-types";
import { Config } from "@services/config";
import type { Member } from "@services/db";
import { JWT } from "@services/jwt";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { okAsync } from "neverthrow";
import { z } from "zod";

const githubWebhooks = new Webhooks({
  secret: Config.github.webhookSecret,
});

export const WebhooksRouter = new Hono()
  .post("/github", async (c) => {
    const signature = c.req.header("x-hub-signature-256");
    const body = await c.req.text();

    if (!(signature && (await githubWebhooks.verify(body, signature)))) {
      return notOk(c, { message: "Unauthorized" }, 401);
    }

    const event = c.req.header("X-GitHub-Event");

    if (event === "installation") {
      const payload = await c.req.json<InstallationEvent>();

      if (payload.action === "created") {
        return IntegrationService.addGithubRepositoriesToIntegration(
          payload.installation.id,
          (payload.repositories || []).map((repository) => ({
            id: repository.id,
            name: repository.name,
            owner: payload.installation.account.login,
          }))
        ).match(
          (repositories) => ok(c, repositories),
          (error) => notOk(c, { message: error.message }, 500)
        );
      }

      if (payload.action === "deleted") {
        return IntegrationService.deleteGithubIntegrationByInstallationId(
          payload.installation.id
        ).match(
          (integration) => ok(c, integration),
          (error) => notOk(c, { message: error.message }, 500)
        );
      }
    }

    if (event === "push") {
      const payload = await c.req.json<PushEvent>();
      const headCommit = payload.head_commit;
      const installation = payload.installation;

      if (headCommit && installation) {
        return Application.createPendingCommit(
          headCommit.id,
          installation.id,
          payload.repository.owner.login,
          payload.repository.name
        ).match(
          (integration) => ok(c, integration),
          (error) => notOk(c, { message: error.message }, 500)
        );
      }
    }

    return ok(c, undefined);
  })
  .get(
    "/github/setup",
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

      const member = {
        organizationId,
      } as Member;

      IntegrationService.getGithubIntegration(member)
        .andThrough((integration) => {
          if (!integration) {
            return IntegrationService.createGithubIntegration(
              member,
              installation_id
            );
          }

          return okAsync(integration);
        })
        .match(
          () => c.redirect(Config.client.raw),
          () => c.redirect(Config.client.raw)
        );

      return c.redirect(Config.client.raw);
    }
  );
