import { Hono } from "hono";
import { auth } from "./auth.client";

export const Auth = new Hono().on(["POST", "GET"], "/**", (c) => auth.handler(c.req.raw));
