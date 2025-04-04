import path from "node:path";
import concurrently from "concurrently";

concurrently(
  [
    {
      command: "bun run dev",
      name: "web",
      cwd: path.resolve(import.meta.dir, "../packages/ui"),
    },
  ],
  {
    prefix: "name",
    killOthers: ["failure", "success"],
    restartTries: 3,
  },
);
