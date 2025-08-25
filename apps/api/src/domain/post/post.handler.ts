import { organizationFactory } from "@domain/organizaiton/organization.factory";
import { Emitter } from "@events";
import { validator } from "@lib/validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { PostCreatedEvent } from "./post.events";
import { PostsService } from "./post.service";

export const PostHandler = organizationFactory
  .createApp()
  .get("/", (c) => {
    const member = c.get("member");

    return PostsService.findPostsByOrganization(member).match(
      (posts) => ok(c, posts),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/",
    validator("json", z.object({ title: z.string().optional() })),
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

  .get("/:id", validator("param", z.object({ id: z.string().uuid() })), (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostsService.findPostById(member, postId).match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/:id/publish",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostsService.publishPostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .post(
    "/:id/unpublish",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostsService.unpublishPostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .put(
    "/:id/schedule",
    validator("param", z.object({ id: z.string().uuid() })),
    validator("json", z.object({ scheduledAt: z.string().datetime() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");
      const { scheduledAt } = c.req.valid("json");

      return PostsService.schedulePostById(
        member,
        postId,
        new Date(scheduledAt)
      ).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .delete(
    "/:id",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostsService.deletePostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
