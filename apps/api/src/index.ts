import { Hono } from "hono";
import { cors } from "hono/cors";
import type { auth } from "./auth/auth.client";
import { Auth } from "./auth/auth.handler";
import { Test } from "./test/test.handler";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .use("*", cors({ origin: ["http://localhost:5173", "http://localhost:4173"], credentials: true }))
  .basePath("/api")
  .route("/auth", Auth)
  .route("/test", Test);

export default {
  port: 3000,
  fetch: app.fetch,
};

export type Api = typeof app;
