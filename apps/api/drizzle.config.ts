import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST || "",
    port: Number.parseInt(process.env.DATABASE_PORT || "5432"),
    user: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
    ssl: false,
  },
});
