import { Config } from "@config";
import { Database } from "@database";
import { Email } from "@email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization } from "better-auth/plugins";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  basePath: "auth",
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
  trustedOrigins: [Config.client.url],
  advanced: {
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
        return Email.send({
          to: data.email,
          subject: "",
          html: "",
        });
      },
    }),
    magicLink({
      sendMagicLink: async (data) => {
        console.log("Magic link sent to", data.email, data.url);
        // TODO: Implement welcome email template
        // TODO: Throw proper error (return error json) if email fails to send
        return Email.send({
          to: data.email,
          subject: "",
          html: "",
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
