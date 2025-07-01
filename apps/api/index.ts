import "dotenv/config";
import { Config } from "@config";
import { AssetsHandler } from "@domain/assets";
import { BoardHandler } from "@domain/board";
import { memberMiddleware } from "@domain/organizaiton/member.middleware";
import { PublicHandler } from "@domain/public";
import { TagHandler } from "@domain/tag";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler, authMiddleware } from "./src/domain/auth";
import { PostHandler } from "./src/domain/post";

export const app = new Hono()
  .use(async (_, next) => {
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 250),
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
    }),
  )
  .route("/auth", AuthHandler)
  .route("/assets", AssetsHandler)
  .route(
    "/organizations/:organizationId",
    new Hono()
      .use(authMiddleware({ required: true }))
      .use(memberMiddleware)
      .route("/posts", PostHandler)
      .route("/tags", TagHandler)
      .route("/boards", BoardHandler),
  );

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => {
    console.log("Server is running on port 4000");
  },
);
