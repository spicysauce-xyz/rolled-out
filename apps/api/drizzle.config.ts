import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: Bun.env.DATABASE_HOST || "",
    port: Number.parseInt(Bun.env.DATABASE_PORT || "5432"),
    user: Bun.env.DATABASE_USERNAME || "",
    password: Bun.env.DATABASE_PASSWORD || "",
    database: Bun.env.DATABASE_NAME || "",
    ssl: false,
  },
});
