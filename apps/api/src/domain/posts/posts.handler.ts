import { notOk, ok } from "@api";
import { authMiddleware } from "@auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { PostsService } from "./posts.service";

export const Posts = new Hono()
  .get("/", authMiddleware({ required: true }), async (c) => {
    const session = c.get("session");
    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return notOk(c, { message: "Organization not found" }, 404);
    }

    const posts = await PostsService.getPostsByOrganizationId(organizationId);

    return ok(c, posts);
  })
  .post(
    "/",
    zValidator("json", z.object({ title: z.string().optional(), content: z.object({}).optional() })),
    authMiddleware({ required: true }),
    async (c) => {
      const session = c.get("session");
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        return notOk(c, { message: "Organization not found" }, 404);
      }

      const { title, content } = c.req.valid("json");

      const post = await PostsService.createPost({
        organizationId,
        title: title ?? "Untitled Update",
        content: content ?? {},
      });

      if (!post) {
        return notOk(c, { message: "Failed to create post" }, 500);
      }

      return ok(c, post);
    },
  )
  .get("/:id", authMiddleware({ required: true }), async (c) => {
    const { id } = c.req.param();

    const post = await PostsService.getPostById(id);

    if (!post) {
      return notOk(c, { message: "Post not found" }, 404);
    }

    return ok(c, post);
  })
  .put(
    "/:id",
    zValidator("json", z.object({ title: z.string(), content: z.record(z.any()) })),
    authMiddleware({ required: true }),
    async (c) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { id } = c.req.param();
      const { title, content } = c.req.valid("json");

      const post = await PostsService.updatePostById(id, { title, content });

      return ok(c, post);
    },
  );
