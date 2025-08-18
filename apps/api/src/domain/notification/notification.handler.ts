import { organizationFactory } from "@domain/organizaiton";
import { validator } from "@lib/validator";
import { notOk, ok } from "@utils/network";
import { z } from "zod";
import { NotificationService } from "./notification.service";

export const NotificationHandler = organizationFactory
  .createApp()
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
