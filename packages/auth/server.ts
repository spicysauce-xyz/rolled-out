import {
  type Adapter,
  type BetterAuthOptions,
  betterAuth,
  type User,
} from "better-auth";
import {
  type Member,
  magicLink,
  type Organization,
  organization,
} from "better-auth/plugins";

interface Params {
  domain: string;
  baseURL: string;
  basePath: string;
  database: (options: BetterAuthOptions) => Adapter;
  trustedOrigins: string[];
  sendInvitationEmail: (data: {
    inviter: Member & { user: User };
    email: string;
    organization: Organization;
  }) => Promise<void>;
  sendMagicLinkEmail: (data: {
    email: string;
    url: string;
    token: string;
  }) => Promise<void>;
  afterOrganizationCreate?: (data: {
    organization: Organization;
    member: Member;
  }) => Promise<void>;
}

export const createServerAuth = (
  params: Params
): ReturnType<typeof betterAuth> =>
  betterAuth({
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
        sendInvitationEmail: (data) =>
          params.sendInvitationEmail({
            inviter: data.inviter,
            email: data.email,
            organization: data.organization,
          }),
        organizationCreation: {
          afterCreate: async (data) => params.afterOrganizationCreate?.(data),
        },
      }),
      magicLink({
        sendMagicLink: params.sendMagicLinkEmail,
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
