import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import z from "zod";
import { TagService } from "../../domain/tag/tag.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const TagsRouter = new Hono<{ Variables: Variables }>()

  .post(
    "/",
    validate(
      "json",
      z.object({
        label: z
          .string()
          .min(3, "Tag must be at least 3 characters long")
          .max(20, "Tag must be less than 20 characters long"),
      })
    ),
    (c) => {
      const member = c.get("member");

      const { label } = c.req.valid("json");

      return TagService.createTag(member, label).match(
        (tag) => ok(c, tag),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )
  .get("/", (c) => {
    const member = c.get("member");

    return TagService.getTags(member).match(
      (tags) => ok(c, tags),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
