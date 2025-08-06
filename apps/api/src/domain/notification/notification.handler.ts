import { authMiddleware } from "@domain/auth";
import { validator } from "@lib/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { NotificationService } from "./notification.service";

export const NotificationHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .get(
    "/",
    validator(
      "query",
      z.object({
        limit: z.number({ coerce: true }).min(1).max(50).optional().default(25),
        offset: z.number({ coerce: true }).min(0).optional().default(0),
      })
    ),
    (c) => {
      const user = c.get("user");
      const { limit, offset } = c.req.valid("query");

      return NotificationService.getNotificationsForUser(user, {
        limit,
        offset,
      }).match(
        (notifications) => ok(c, notifications),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )
  .get("/status", (c) => {
    const user = c.get("user");

    return NotificationService.getNotificationsStatusForUser(user).match(
      (status) => ok(c, status),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put("/status", (c) => {
    const user = c.get("user");

    return NotificationService.markNotificationsAsReadForUser(user).match(
      () => ok(c, undefined),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
