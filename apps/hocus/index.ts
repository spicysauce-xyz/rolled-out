import "dotenv/config";
import { authMiddleware } from "@auth";
import { Config } from "@config";
import { Database as DatabaseExtension } from "@hocuspocus/extension-database";
import { Logger } from "@hocuspocus/extension-logger";
import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  deletePostTagsByDocumentName,
  getPostByDocumentName,
  insertPostTagsByDocumentName,
  updatePostByDocumentName,
  upsertEditorsByDocumentName,
} from "@utils/db";
import { getDocumentTags, getDocumentTitle } from "@utils/document";
import { addUserIdToEditorsMap } from "@utils/map";
import { Hono } from "hono";
import { cors } from "hono/cors";

const editorsMap = new Map<string, Set<string>>();

const hocuspocus = new Hocuspocus({
  onChange: async ({ documentName, context }) => {
    addUserIdToEditorsMap(editorsMap, documentName, context.user.id);
  },
  extensions: [
    new Logger(),
    new DatabaseExtension({
      fetch: async ({ documentName }) => {
        const post = await getPostByDocumentName(documentName);

        return post?.byteContent ?? null;
      },
      store: async ({ documentName, document, state }) => {
        const title = getDocumentTitle(document);

        await updatePostByDocumentName(documentName, {
          byteContent: state,
          title,
        });

        const editors = editorsMap.get(documentName);
        editorsMap.delete(documentName);

        if (editors?.size) {
          await upsertEditorsByDocumentName(documentName, Array.from(editors));
        }

        const tags = getDocumentTags(document);

        await deletePostTagsByDocumentName(documentName);

        if (tags.length) {
          await insertPostTagsByDocumentName(
            documentName,
            tags.map(({ id }) => id),
          );
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
