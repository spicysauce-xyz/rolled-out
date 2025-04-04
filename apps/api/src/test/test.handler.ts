import { Hono } from "hono";
import { authMiddleware } from "../auth/auth.middleware";

export const Test = new Hono().get("/", authMiddleware, (c) => {
  const user = c.get("user");

  return c.json({ message: `You are logged in as ${user?.email}` });
});
