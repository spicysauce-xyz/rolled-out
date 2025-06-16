import { Config } from "@config";
import { Database } from "@database";
import { createServerAuth, drizzleAdapter } from "@mono/auth/server";

export const auth = createServerAuth({
  baseURL: Config.self.base,
  basePath: "/auth",
  database: drizzleAdapter(Database, {
    provider: "pg",
  }),
  domain: `.${Config.client.domain.split(".").slice(-2).join(".")}`,
  trustedOrigins: [Config.client.base],
});
