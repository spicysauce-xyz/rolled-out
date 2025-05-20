import { Config } from "@config";
import { Resend } from "resend";

const resend = new Resend(Config.resend.apiKey);

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const Email = {
  async send(payload: EmailPayload) {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  },
};
