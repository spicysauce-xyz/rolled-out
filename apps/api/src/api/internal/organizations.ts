import type { AuthMiddleware } from "@api/middleware/auth";
import { organizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { Emitter } from "@services/events";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import z from "zod";
import { OrganizationCreatedEvent } from "../../domain/organizaiton/organization.events";
import { OrganizationService } from "../../domain/organizaiton/organization.service";

// Validation for website URL (must start with http/https and have no pathname)
const websiteUrlSchema = z
  .string()
  .trim()
  .min(1, "Website URL is required")
  .url("Invalid URL format")
  .refine(
    (val) => val.startsWith("http://") || val.startsWith("https://"),
    { message: "URL must start with http:// or https://" }
  )
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        return url.pathname === "" || url.pathname === "/";
      } catch {
        return false;
      }
    },
    { message: "URL must not contain a path (pathname must be empty or '/')" }
  );

type Variables = AuthMiddleware<true>["Variables"];

export const OrganizationsRouter = new Hono<{ Variables: Variables }>()
  .get(
    "/check-slug",
    validate("query", z.object({ slug: z.string() })),
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
    validate(
      "json",
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string().optional(),
        websiteUrl: websiteUrlSchema,
      })
    ),
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
  .get("/:organizationId", organizationMiddleware(), (c) => {
    const id = c.req.param("organizationId");
    const member = c.get("member");

    return OrganizationService.getOrganizationById(member, id).match(
      (organization) => ok(c, organization),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put(
    "/:organizationId",
    organizationMiddleware(),
    validate(
      "json",
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string().optional(),
        websiteUrl: websiteUrlSchema.optional(),
      })
    ),
    (c) => {
      const id = c.req.param("organizationId");
      const data = c.req.valid("json");
      const member = c.get("member");

      return OrganizationService.updateOrganization(member, id, data).match(
        (organization) => ok(c, organization),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
