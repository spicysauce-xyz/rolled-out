import path from "node:path";
import concurrently from "concurrently";

concurrently(
  [
    {
      command: "bun run dev",
      name: "web",
      cwd: path.resolve(import.meta.dir, "../apps/web"),
    },
    {
      command: "bun run dev",
      name: "api",
      cwd: path.resolve(import.meta.dir, "../apps/api"),
    },
  ],
  {
    prefix: "name",
    killOthers: ["failure", "success"],
    restartTries: 3,
  },
);
