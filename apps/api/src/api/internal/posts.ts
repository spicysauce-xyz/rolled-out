import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { Application } from "@application";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
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
    validate("json", z.object({ githubIds: z.array(z.string()).optional() })),
    (c) => {
      const member = c.get("member");
      const { githubIds } = c.req.valid("json");

      return Application.createPost(member, githubIds).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .get("/:id", validate("param", z.object({ id: z.string().uuid() })), (c) => {
    const postId = c.req.param("id");
    const member = c.get("member");

    return PostService.findPostById(member, postId).match(
      (post) => ok(c, post),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })

  .post(
    "/:id/publish",
    validate("param", z.object({ id: z.string().uuid() })),
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
    validate("param", z.object({ id: z.string().uuid() })),
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
    validate("param", z.object({ id: z.string().uuid() })),
    validate("json", z.object({ scheduledAt: z.string().datetime() })),
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
    validate("param", z.object({ id: z.string().uuid() })),
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
    validate("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return Application.duplicatePost(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )

  .delete(
    "/:id",
    validate("param", z.object({ id: z.string().uuid() })),
    (c) => {
      const postId = c.req.param("id");
      const member = c.get("member");

      return PostService.deletePostById(member, postId).match(
        (post) => ok(c, post),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  );
