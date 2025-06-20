import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { PostsService } from "./post.service";

export const PostHandler = organizationFactory
  .createApp()
  .get("/", async (c) => {
    const member = c.get("member");

    const posts = await PostsService.getPostsFromOrganization(member);

    return ok(c, posts);
  })

  .post("/", zValidator("json", z.object({ title: z.string().optional() })), async (c) => {
    const member = c.get("member");

    const postResult = await PostsService.createPost(member);

    if (postResult.isErr()) {
      return notOk(c, { message: postResult.error.message }, 500);
    }

    return ok(c, postResult.value);
  })

  .get("/:id", async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const postResult = await PostsService.getPostById(member, postId);

    if (postResult.isErr()) {
      return notOk(c, { message: postResult.error.message }, 500);
    }

    return ok(c, postResult.value);
  })

  .post("/:id/publish", async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const publishedPost = await PostsService.updatePostStatusById(member, postId, "published");

    if (publishedPost.isErr()) {
      return notOk(c, { message: publishedPost.error.message }, 500);
    }

    return ok(c, publishedPost.value);
  })

  .post("/:id/archive", async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const achievedPost = await PostsService.updatePostStatusById(member, postId, "archived");

    if (achievedPost.isErr()) {
      return notOk(c, { message: achievedPost.error.message }, 500);
    }

    return ok(c, achievedPost.value);
  })

  .post("/:id/unarchive", async (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    const draftPost = await PostsService.updatePostStatusById(member, postId, "draft");

    if (draftPost.isErr()) {
      return notOk(c, { message: draftPost.error.message }, 500);
    }

    return ok(c, draftPost.value);
  });
