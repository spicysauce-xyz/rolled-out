import "dotenv/config";
import { internalApi } from "@api/internal";
import { throttleDevEnvironment } from "@api/middleware/throttle";
import { v1Api } from "@api/v1";
import { webhooksApi } from "@api/webhooks";
import { registerEvents, registerWorkers } from "@domain";
import { serve } from "@hono/node-server";
import { Config } from "@services/config";
import { Hono } from "hono";
import { logger } from "hono/logger";

registerEvents();
registerWorkers();

export const app = new Hono()
  .use(throttleDevEnvironment(250, 500))
  .use(logger())
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/v1", v1Api)
  .route("/webhooks", webhooksApi)
  .route("/", internalApi);

serve(
  {
    fetch: app.fetch,
    port: Config.port,
  },
  () => {
    console.log("Server is running on port 4000");
  }
);
