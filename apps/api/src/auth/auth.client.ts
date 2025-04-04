import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { database } from "../database/database.client";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization()],
  trustedOrigins: ["http://localhost:5173", "http://localhost:4173"],
});
