import "dotenv/config";
import { authMiddleware } from "@auth";
import { Config } from "@config";
import { Database, schema } from "@database";
import { Database as DatabaseExtension } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";

const editorsMap = new Map<string, Set<string>>();

const hocuspocus = new Hocuspocus({
  onChange: async ({ documentName, context }) => {
    if (!editorsMap.has(documentName)) {
      editorsMap.set(documentName, new Set());
    }

    const set = editorsMap.get(documentName) as Set<string>;
    const userId = context.user.id;

    if (userId) {
      set.add(userId);
    }
  },
  extensions: [
    new DatabaseExtension({
      fetch: async ({ documentName }) => {
        const post = await Database.query.post.findFirst({
          where: eq(schema.post.id, documentName),
        });

        return post?.byteContent ?? null;
      },
      store: async ({ documentName, document, state }) => {
        const { default: jsonDocument } = TiptapTransformer.fromYdoc(document);

        const title =
          jsonDocument?.content?.[0]?.content?.[0]?.text?.trim() ||
          "Untitled Update";

        await Database.update(schema.post)
          .set({
            byteContent: state,
            title,
            updatedAt: new Date(),
          })
          .where(eq(schema.post.id, documentName));

        const editors = editorsMap.get(documentName);
        editorsMap.delete(documentName);

        if (editors?.size) {
          await Database.insert(schema.editor)
            .values(
              Array.from(editors).map((userId) => ({
                postId: documentName,
                userId,
              })),
            )
            .onConflictDoNothing();
        }
      },
    }),
  ],
});

const hocusApp = new Hono();

hocusApp.use(cors({ origin: [Config.client.base], credentials: true }));

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app: hocusApp,
});

hocusApp.get(
  "/",
  authMiddleware({ required: true }),
  upgradeWebSocket((c) => {
    const user = c.get("user");

    return {
      onOpen(_evt, ws) {
        // @ts-expect-error Request type mismatch
        hocuspocus.handleConnection(ws.raw, c.req.raw, { user });
      },
    };
  }),
);

const hocusServer = serve(
  {
    fetch: hocusApp.fetch,
    port: 4100,
  },
  (info) => {
    console.log(`Hocuspocus server is running on port ${info.port}`);
    hocuspocus.hooks("onListen", {
      instance: hocuspocus,
      configuration: hocuspocus.configuration,
      port: info.port,
    });
  },
);

injectWebSocket(hocusServer);
