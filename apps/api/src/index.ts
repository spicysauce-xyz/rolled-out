import { Config } from "@config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler } from "./domain/auth";
import { PostHandler } from "./domain/post";

export const app = new Hono()
  .basePath("/api")
  .use(logger())
  .use(cors({ origin: [`https://${Config.domain}`], credentials: true }))
  .route("/", AuthHandler)
  .route("/", PostHandler);

export default {
  port: 4000,
  fetch: app.fetch,
};
