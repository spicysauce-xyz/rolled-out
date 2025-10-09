import { validate } from "@api/middleware/validate";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import z from "zod";
import { PublicService } from "../../domain/public/public.service";

export const PublicRouter = new Hono()
  .basePath("/public")
  .get(
    "/:organizationSlug",
    validate("param", z.object({ organizationSlug: z.string().min(1) })),
    (c) => {
      return PublicService.getOrganizationBySlug(
        c.req.param("organizationSlug")
      ).match(
        (organization) => ok(c, organization),
        (error) => notOk(c, { message: (error as Error).message }, 500)
      );
    }
  )
  .get(
    "/:organizationSlug/posts",
    validate("param", z.object({ organizationSlug: z.string().min(1) })),
    (c) => {
      return PublicService.getPublishedPostsFromOrganization(
        c.req.param("organizationSlug")
      ).match(
        (posts) => ok(c, posts),
        (error) => notOk(c, { message: (error as Error).message }, 500)
      );
    }
  );
