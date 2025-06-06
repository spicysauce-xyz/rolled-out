import "dotenv/config";
import { Config } from "@config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler } from "./src/domain/auth";
import { PostHandler } from "./src/domain/post";

export const app = new Hono()
  .use(logger())
  .use(cors({ origin: [Config.client.base], credentials: true }))
  .route("/", AuthHandler)
  .route("/", PostHandler);

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => {
    console.log("Server is running on port 4000");
  },
);
