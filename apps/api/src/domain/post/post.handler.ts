import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { authMiddleware } from "../auth";
import { PostsService } from "./post.service";

export const PostHandler = organizationFactory
  .createApp()
  .get("/", async (c) => {
    const member = c.get("member");

    const posts = await PostsService.getPostsByOrganizationId(member.organizationId);

    return ok(c, posts);
  })
  .post(
    "/",
    zValidator("json", z.object({ title: z.string().optional(), content: z.object({}).optional() })),
    async (c) => {
      const member = c.get("member");

      const { title, content } = c.req.valid("json");

      const post = await PostsService.createPost({
        organizationId: member.organizationId,
        title: title ?? "Untitled Update",
        content: content ?? {},
        createdBy: member.userId,
      });

      if (!post) {
        return notOk(c, { message: "Failed to create post" }, 500);
      }

      return ok(c, post);
    },
  )
  .get("/:id", authMiddleware({ required: true }), async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const post = await PostsService.getPostById(postId);

    if (post?.organizationId !== member.organizationId) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    if (!post) {
      return notOk(c, { message: "Post not found" }, 404);
    }

    return ok(c, post);
  })
  .patch(
    "/:id",
    zValidator("json", z.object({ title: z.string(), content: z.record(z.any()) })),
    authMiddleware({ required: true }),
    async (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      const post = await PostsService.getPostById(postId);

      if (post?.organizationId !== member.organizationId) {
        return notOk(c, { message: "Forbidden" }, 403);
      }

      if (!post) {
        return notOk(c, { message: "Post not found" }, 404);
      }

      if (post.status === "published") {
        return notOk(c, { message: "Cannot edit published post" }, 400);
      }

      const { title, content } = c.req.valid("json");
      const updatedPost = await PostsService.updatePostById(postId, { title, content });

      return ok(c, updatedPost);
    },
  )
  .post("/:id/publish", authMiddleware({ required: true }), async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const post = await PostsService.getPostById(postId);

    if (post?.organizationId !== member.organizationId) {
      return notOk(c, { message: "Forbidden" }, 403);
    }

    if (!post) {
      return notOk(c, { message: "Post not found" }, 404);
    }

    if (post.status === "published") {
      return notOk(c, { message: "Post already published" }, 400);
    }

    const publishedPost = await PostsService.publishPostById(postId);

    return ok(c, publishedPost);
  });
