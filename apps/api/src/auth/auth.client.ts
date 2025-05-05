import { Database } from "@database";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, magicLink } from "better-auth/plugins";

const options = {
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
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        console.log({ email, token, url });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...(options || {}),
  plugins: [
    ...options.plugins,
    customSession(async ({ user, session }) => {
      return {
        user,
        session,
      };
    }, options),
  ],
});
