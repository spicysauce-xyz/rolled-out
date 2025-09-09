import { validator } from "@services/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import z from "zod";
import { PublicService } from "../../domain/public/public.service";

export const PublicRouter = new Hono()
  .basePath("/public")
  .get(
    "/:organizationSlug/posts",
    validator("param", z.object({ organizationSlug: z.string().min(1) })),
    (c) => {
      return PublicService.getPublishedPostsFromOrganization(
        c.req.param("organizationSlug")
      ).match(
        (posts) => ok(c, posts),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
