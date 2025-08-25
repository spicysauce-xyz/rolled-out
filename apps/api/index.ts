import "dotenv/config";
import { Config } from "@config";
import { AssetsHandler } from "@domain/assets";
import { AuthHandler } from "@domain/auth";
import { BoardHandler } from "@domain/board";
import {
  OrganizationHandler,
  organizationMiddleware,
} from "@domain/organizaiton";
import { PostHandler } from "@domain/post";
import { PublicHandler } from "@domain/public";
import { TagHandler } from "@domain/tag";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "@domain/editor";
import { InvitationHandler } from "@domain/invitation";
import { NotificationHandler } from "@domain/notification";
// Initialize the queue system
import "@lib/queue";

export const app = new Hono()
  .use(async (_, next) => {
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 250)
      );
    }
    await next();
  })
  .use(logger())
  .route("/public", PublicHandler)
  .use(
    cors({
      origin: [Config.client.base],
      credentials: true,
    })
  )
  .route("/auth", AuthHandler)
  .route("/assets", AssetsHandler)
  .route("/invitations", InvitationHandler)
  .route(
    "/organizations",
    OrganizationHandler.route(
      "/:organizationId",
      new Hono()
        .use(organizationMiddleware)
        .route("/posts", PostHandler)
        .route("/tags", TagHandler)
        .route("/boards", BoardHandler)
        .route("/notifications", NotificationHandler)
    )
  );

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => {
    console.log("Server is running on port 4000");
  }
);
