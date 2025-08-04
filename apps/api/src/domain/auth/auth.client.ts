import { Config } from "@config";
import { Database } from "@database";
import { Email } from "@email";
import { Emitter } from "@events";
import { KV } from "@kv";
import { createServerAuth, drizzleAdapter } from "@mono/auth/server";
import { OrganizationCreatedEvent } from "./auth.events";

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
  sendInvitationEmail: async (data) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Member invite email sent:", data);
      return;
    }

    // TODO: Throw proper error (return error json) if email fails to send
    await Email.sendMemberInviteEmail({
      to: data.email,
      props: {
        inviterName: data.inviter.user.name,
        organizationName: data.organization.name,
      },
    });
  },
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
  afterOrganizationCreate: async (data) => {
    await Emitter.emitAsync(
      OrganizationCreatedEvent.eventName,
      new OrganizationCreatedEvent(data.organization, data.member)
    );
  },
});
