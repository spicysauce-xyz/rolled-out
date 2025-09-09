import type { AuthMiddleware } from "@api/middleware/auth";
import { Emitter } from "@services/events";
import { validator } from "@services/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import z from "zod";
import { OrganizationCreatedEvent } from "../../domain/organizaiton/organization.events";
import { OrganizationService } from "../../domain/organizaiton/organization.service";

type Variables = AuthMiddleware<true>["Variables"];

export const OrganizationsRouter = new Hono<{ Variables: Variables }>()
  .get(
    "/check-slug",
    validator("query", z.object({ slug: z.string() })),
    (c) => {
      const slug = c.req.valid("query").slug;

      return OrganizationService.checkSlug(slug).match(
        (data) => ok(c, data),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )
  .post(
    "/",
    validator("json", z.object({ name: z.string(), slug: z.string() })),
    (c) => {
      const data = c.req.valid("json");
      const user = c.get("user");

      return OrganizationService.createOrganization(data)
        .andThrough((organization) =>
          Emitter.emitAsync(
            OrganizationCreatedEvent.eventName,
            new OrganizationCreatedEvent(organization, user)
          )
        )
        .match(
          (organization) => ok(c, organization),
          (error) => notOk(c, { message: error.message }, 500)
        );
    }
  )
  .get("/:organizationId", (c) => {
    const id = c.req.param("organizationId");

    return OrganizationService.getOrganizationById(id).match(
      (organization) => ok(c, organization),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put(
    "/:organizationId",
    validator(
      "json",
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string().optional(),
      })
    ),
    (c) => {
      const id = c.req.param("organizationId");
      const data = c.req.valid("json");

      return OrganizationService.updateOrganization(id, data).match(
        (organization) => ok(c, organization),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
