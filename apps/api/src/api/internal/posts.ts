import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { Emitter } from "@services/events";
import { validator } from "@services/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { PostCreatedEvent } from "../../domain/post/post.events";
import { PostService } from "../../domain/post/post.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const PostsRouter = new Hono<{ Variables: Variables }>()
  .get("/", (c) => {
    const member = c.get("member");

    return PostService.findPostsByOrganization(member).match(
      (posts) => ok(c, posts),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/",
    validator("json", z.object({ title: z.string().optional() })),
    (c) => {
      const member = c.get("member");

      return PostService.createPost(member)
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

    return PostService.findPostById(member, postId).match(
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

      return PostService.publishPostById(member, postId).match(
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

      return PostService.unpublishPostById(member, postId).match(
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

      return PostService.schedulePostById(
        member,
        postId,
        new Date(scheduledAt)
      ).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .put(
    "/:id/unschedule",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostService.unschedulePostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .put(
    "/:id/duplicate",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostService.duplicatePostById(member, postId)
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

  .delete(
    "/:id",
    validator("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostService.deletePostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
