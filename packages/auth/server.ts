import * as BetterAuth from "better-auth";
import { magicLink, organization } from "better-auth/plugins";

interface Params {
  domain: string;
  baseURL: string;
  basePath: string;
  database: (options: BetterAuth.BetterAuthOptions) => BetterAuth.Adapter;
  trustedOrigins: string[];
  sendInvitationEmail?: (data: {
    invitation: { email: string; role: string };
  }) => Promise<void>;
  sendMagicLinkEmail?: (data: {
    email: string;
    url: string;
    token: string;
  }) => Promise<void>;
}

export const createServerAuth = (
  params: Params,
): ReturnType<typeof BetterAuth.betterAuth> =>
  BetterAuth.betterAuth({
    baseURL: params.baseURL,
    basePath: params.basePath,
    database: params.database,
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
    trustedOrigins: params.trustedOrigins,
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: params.domain,
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
        sendInvitationEmail: params.sendInvitationEmail,
      }),
      magicLink({
        sendMagicLink: params.sendMagicLinkEmail ?? (async () => {}),
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

export { drizzleAdapter } from "better-auth/adapters/drizzle";
