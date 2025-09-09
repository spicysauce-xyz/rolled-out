import { auth } from "@services/auth";
import { Hono } from "hono";

export const AuthRouter = new Hono().on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
