import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler } from "./domain/auth";
import { PostHandler } from "./domain/post";

export const app = new Hono()
  .use(logger())
  .use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"], credentials: true }))
  .route("/auth", AuthHandler)
  .route("/posts", PostHandler);

export default {
  port: 3000,
  fetch: app.fetch,
};
