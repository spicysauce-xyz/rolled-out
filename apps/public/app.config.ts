import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/react-start/config'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  routers: {
    ssr: {
      entry: "./src/server.entry.tsx",
    },
    client: {
      entry: "./src/client.entry.tsx",
    },
  },
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
    build: {
      target: "ES2022",
    },
  },
  tsr: {
    generatedRouteTree: "./src/generated/router.ts",
    virtualRouteConfig: "./src/modules/routes.ts",
    routesDirectory: "./src/modules" 
  }
});
