import { Config } from "@config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler } from "./domain/auth";
import { PostHandler } from "./domain/post";

export const app = new Hono()
  .use(logger())
  .use(cors({ origin: [Config.client.base], credentials: true }))
  .route("/", AuthHandler)
  .route("/", PostHandler);

export default {
  port: Config.self.port || 4000,
  fetch: app.fetch,
};
