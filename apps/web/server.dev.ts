import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const createBaseTag = (href: string) => `<base href="${href}" />`;

const createConfigTag = (config: Record<string, unknown>) => {
  return `
    <script>
      window.__APP_CONFIG__ = ${JSON.stringify(config)};
    </script>
  `;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Bun.env.PORT || new URL(Bun.env.SELF || "").port || 3000;
const pathname = new URL(Bun.env.SELF || "").pathname;
const BASE = pathname && pathname !== "/" ? `${pathname}/` : "/";

const start = async () => {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*all", async (req, res, next) => {
    const start = Date.now();
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8",
      );

      template = template.replace("<!-- BASE -->", createBaseTag(BASE));
      template = template.replace(
        "<!-- CONFIG -->",
        createConfigTag({
          self: Bun.env.SELF,
          api: Bun.env.API,
        }),
      );

      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    } finally {
      const end = Date.now();
      console.log(`[${end - start}ms] ${url}`);
    }
  });

  app.listen(PORT, () => {
    console.log(`[DEV] Server is running on port ${PORT} with base ${BASE}`);
  });
};

start();
