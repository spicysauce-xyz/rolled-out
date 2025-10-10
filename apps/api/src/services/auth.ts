import { Email } from "@email";
import { createServerAuth, drizzleAdapter } from "@mono/auth/server";
import { Config } from "@services/config";
import { Database } from "@services/db";
import { KV } from "@services/kv";

export const auth: ReturnType<typeof createServerAuth> = createServerAuth({
  baseURL: Config.self.base,
  basePath: "/auth",
  database: drizzleAdapter(Database, {
    provider: "pg",
  }),
  secondaryStorage: {
    get: async (key) => KV.get(key),
    set: async (key, value, ttl) =>
      KV.set(key, value, {
        expiration: ttl ? { type: "EX", value: ttl } : undefined,
      }),
    delete: async (key) => {
      await KV.del(key);
    },
  },
  domain: `.${Config.client.domain.split(".").slice(-2).join(".")}`,
  trustedOrigins: [Config.client.base],
  sendMagicLinkEmail: async (data) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Magic link email sent:", data.email, data.url);
      return;
    }

    // TODO: Throw proper error (return error json) if email fails to send
    await Email.sendMagicLinkEmail({
      to: data.email,
      props: {
        link: data.url,
      },
    });
  },
  github: {
    clientId: Config.githubAuth.clientId,
    clientSecret: Config.githubAuth.clientSecret,
  },
  google: {
    clientId: Config.googleAuth.clientId,
    clientSecret: Config.googleAuth.clientSecret,
  },
});
