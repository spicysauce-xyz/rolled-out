import { Database, schema } from "@database";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../auth";
import { PostsService } from "./post.service";

export const PostHandler = new Hono()
  .basePath("/organization/:organizationId/posts")
  .get("/", authMiddleware({ required: true }), async (c) => {
    const user = c.get("user");
    const organizationId = c.req.param("organizationId");

    const member = await Database.query.member.findFirst({
      where: and(eq(schema.member.userId, user.id), eq(schema.member.organizationId, organizationId)),
    });

    if (!member) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    const posts = await PostsService.getPostsByOrganizationId(organizationId);

    return ok(c, posts);
  })
  .post(
    "/",
    zValidator("json", z.object({ title: z.string().optional(), content: z.object({}).optional() })),
    authMiddleware({ required: true }),
    async (c) => {
      const organizationId = c.req.param("organizationId");

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
  // not secure
  .get("/:id", authMiddleware({ required: true }), async (c) => {
    const { id } = c.req.param();

    const post = await PostsService.getPostById(id);

    if (!post) {
      return notOk(c, { message: "Post not found" }, 404);
    }

    return ok(c, post);
  })
  // not secure
  .patch(
    "/:id",
    zValidator("json", z.object({ title: z.string(), content: z.record(z.any()) })),
    authMiddleware({ required: true }),
    async (c) => {
      const { id } = c.req.param();
      const { title, content } = c.req.valid("json");

      const post = await PostsService.updatePostById(id, { title, content });

      return ok(c, post);
    },
  );
