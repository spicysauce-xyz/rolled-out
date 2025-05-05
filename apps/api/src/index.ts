import { Auth } from "@auth";
import { Posts } from "@domain/posts";
import { Organization } from "@meta/organization";
import { User } from "@meta/user";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const app = new Hono()
  .use(logger())
  .use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"], credentials: true }))
  .route("/auth", Auth)
  .route("/users", User)
  .route("/organizations", Organization)
  .route("/posts", Posts);

export default {
  port: 3000,
  fetch: app.fetch,
};
