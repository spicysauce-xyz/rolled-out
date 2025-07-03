import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { PublicService } from "./public.service";

export const PublicHandler = new Hono().get("/:organizationSlug/posts", (c) => {
  return PublicService.getPublishedPostsFromOrganization(
    c.req.param("organizationSlug")
  ).match(
    (posts) => ok(c, posts),
    (error) => notOk(c, { message: error.message }, 500)
  );
});
