import { Database } from "@database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(Database, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  session: {
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:4173"],
  advanced: {
    generateId: false,
  },
  plugins: [organization()],
});
