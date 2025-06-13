import "dotenv/config";
import { Config } from "@config";
import { Database, schema } from "@database";
import { AssetsHandler } from "@domain/assets";
import { memberMiddleware } from "@domain/organizaiton/member.middleware";
import { PublicHandler } from "@domain/public";
import { Database as DatabaseExtension } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthHandler, authMiddleware } from "./src/domain/auth";
import { PostHandler } from "./src/domain/post";

export const app = new Hono()
  .use(async (_, next) => {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 1000 + 250),
      );
    }
    await next();
  })
  .use(logger())
  .use(cors({ origin: [Config.client.base], credentials: true }))
  .route("/auth", AuthHandler)
  .route("/assets", AssetsHandler)
  .route("/public", PublicHandler)
  .route(
    "/organizations/:organizationId",
    new Hono()
      .use(authMiddleware({ required: true }))
      .use(memberMiddleware)
      .route("/posts", PostHandler),
  );

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => {
    console.log("Server is running on port 4000");
  },
);

const hocuspocus = new Hocuspocus({
  onChange: async (data) => {
    console.log("onChange", data.socketId);
  },
  extensions: [
    new DatabaseExtension({
      fetch: async ({ documentName }) => {
        const post = await Database.query.post.findFirst({
          where: eq(schema.post.id, documentName),
        });

        return post?.byteContent ?? null;
      },
      store: async ({ documentName, state }) => {
        await Database.update(schema.post)
          .set({
            byteContent: state,
          })
          .where(eq(schema.post.id, documentName));
      },
    }),
  ],
});

const hocusApp = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app: hocusApp,
});

hocusApp.use(cors({ origin: [Config.client.base], credentials: true }));
hocusApp.use(authMiddleware({ required: true }));

hocusApp.get(
  "/hocuspocus",
  upgradeWebSocket((c) => {
    const user = c.get("user");

    return {
      onOpen(_evt, ws) {
        hocuspocus.handleConnection(ws.raw, c.req.raw as any, { user });
      },
    };
  }),
);

const hocusServer = serve(
  {
    fetch: app.fetch,
    port: 8787,
  },
  (info) => {
    console.log("Hocuspocus server is running on port 8787");
    hocuspocus.hooks("onListen", {
      instance: hocuspocus,
      configuration: hocuspocus.configuration,
      port: info.port,
    });
  },
);

// Setup WebSocket support (Node.js specific)
injectWebSocket(hocusServer);
