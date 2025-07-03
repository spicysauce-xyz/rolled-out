import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { Emitter } from "@events";
import { zValidator } from "@hono/zod-validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { PostCreatedEvent } from "./post.events";
import { PostsService } from "./post.service";

export const PostHandler = organizationFactory
  .createApp()
  .get("/", (c) => {
    const member = c.get("member");

    return PostsService.getPostsFromOrganization(member).match(
      (posts) => ok(c, posts),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/",
    zValidator("json", z.object({ title: z.string().optional() })),
    (c) => {
      const member = c.get("member");

      return PostsService.createPost(member)
        .andThrough((post) =>
          Emitter.emitAsync(
            PostCreatedEvent.eventName,
            new PostCreatedEvent(post, member)
          )
        )
        .match(
          (post) => ok(c, post),
          (error) => notOk(c, { message: error.message }, 500)
        );
    }
  )

  .get("/:id", (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostsService.getPostById(member, postId).match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post("/:id/publish", (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostsService.updatePostStatusById(member, postId, "published").match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post("/:id/archive", (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostsService.updatePostStatusById(member, postId, "archived").match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post("/:id/unarchive", (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostsService.updatePostStatusById(member, postId, "draft").match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
