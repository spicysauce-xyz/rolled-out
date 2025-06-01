import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import express from "express";
import sirv from "sirv";

const createBaseTag = (href: string) => `<base href="${href}" />`;

const createConfigTag = (config: Record<string, unknown>) => {
  return `
    <script>
      window.__APP_CONFIG__ = ${JSON.stringify(config)};
    </script>
  `;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const BASE = `${new URL(Bun.env.SELF || "").pathname}/` || "/";

const start = async () => {
  const app = express();

  app.use(compression());
  app.use(sirv("./dist", { extensions: [] }));

  app.use("*all", async (req, res) => {
    const start = Date.now();
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "dist/index.html"),
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

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      console.error(error);
      res.status(500).end();
    } finally {
      const end = Date.now();
      console.log(`[${end - start}ms] ${url}`);
    }
  });

  app.listen(PORT, () => {
    console.log(`[PROD] Server is running on port ${PORT} with base ${BASE}`);
  });
};

start();
