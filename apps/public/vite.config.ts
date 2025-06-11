import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "./.vite",
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      tsr: {
        generatedRouteTree: "./src/generated/router.ts",
        virtualRouteConfig: "./src/modules/routes.ts",
        routesDirectory: "./src/modules",
      },
    }),
  ],
  build: {
    target: "ES2022",
  },
});
