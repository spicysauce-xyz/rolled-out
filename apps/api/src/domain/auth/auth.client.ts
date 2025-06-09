import { Config } from "@config";
import { Database } from "@database";
import { Email } from "@email";
import * as BetterAuth from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization } from "better-auth/plugins";

export const auth: ReturnType<typeof BetterAuth.betterAuth> = BetterAuth.betterAuth({
  baseURL: Config.self.base,
  basePath: "/auth",
  database: drizzleAdapter(Database, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      onboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  socialProviders: {
    google: {
      clientId: "100000000000000000000",
      clientSecret: "100000000000000000000",
    },
    github: {
      clientId: "100000000000000000000",
      clientSecret: "100000000000000000000",
    },
  },
  trustedOrigins: [Config.client.base],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: `.${Config.client.domain.split(".").slice(-2).join(".")}`,
    },
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      partitioned: process.env.NODE_ENV === "production",
    },
    database: {
      generateId: false,
    },
  },
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        console.log("Invitation email sent to", data.invitation.email, data.invitation.role);
        // TODO: Implement invitation email template
        // TODO: Throw proper error (return error json) if email fails to send
        return;
      },
    }),
    magicLink({
      sendMagicLink: async (data) => {
        // TODO: Throw proper error (return error json) if email fails to send
        await Email.sendMagicLinkEmail({
          to: data.email,
          props: {
            link: data.url,
          },
        });
      },
    }),
  ],
  rateLimit: {
    enabled: true,
    max: 100,
    window: 10,
    customRules: {
      "/sign-in/magic-link": {
        max: 1,
        window: 30,
      },
    },
  },
});
