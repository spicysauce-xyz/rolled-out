import { Config } from "@config";
import { Database } from "@database";
import { Email } from "@email";
import { createServerAuth, drizzleAdapter } from "@mono/auth/server";

export const auth = createServerAuth({
  baseURL: Config.self.base,
  basePath: "/auth",
  database: drizzleAdapter(Database, {
    provider: "pg",
  }),
  domain: `.${Config.client.domain.split(".").slice(-2).join(".")}`,
  trustedOrigins: [Config.client.base],
  sendInvitationEmail: async (data) => {
    console.log("Invitation email sent to", data.invitation.email, data.invitation.role);
    // TODO: Implement invitation email template
    // TODO: Throw proper error (return error json) if email fails to send
    return;
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
});
