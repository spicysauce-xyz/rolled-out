import { Hono } from "hono";
import { PublicRouter } from "./public";

export const v1Api = new Hono().route("/", PublicRouter);
