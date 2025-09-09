import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validator } from "@services/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { NotificationService } from "../../domain/notification/notification.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const NotificationsRouter = new Hono<{ Variables: Variables }>()

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
      const member = c.get("member");
      const { limit, offset } = c.req.valid("query");

      return NotificationService.getNotificationsForMember(member, {
        limit,
        offset,
      }).match(
        (notifications) => ok(c, notifications),
        (error) => notOk(c, { message: error.message }, 500)
      );
    }
  )
  .get("/status", (c) => {
    const member = c.get("member");

    return NotificationService.getNotificationsStatusForMember(member).match(
      (status) => ok(c, status),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put("/status", (c) => {
    const member = c.get("member");

    return NotificationService.markNotificationsAsReadForMember(member).match(
      () => ok(c, undefined),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
