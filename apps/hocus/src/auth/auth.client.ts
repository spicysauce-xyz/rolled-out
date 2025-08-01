import { Config } from "@config";
import { Database } from "@database";
import { KV } from "@kv";
import { createServerAuth, drizzleAdapter } from "@mono/auth/server";

export const auth = createServerAuth({
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
});
