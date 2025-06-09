import { Config } from "@config";
import MagicLinkEmail from "@email/templates/magic-link";
import { Resend } from "resend";

const resend = new Resend(Config.resend.apiKey);

interface EmailPayload<T> {
  to: string;
  subject?: string;
  props: T;
}

export const Email = {
  async sendMagicLinkEmail(
    payload: EmailPayload<
      React.ComponentPropsWithoutRef<typeof MagicLinkEmail>
    >,
  ) {
    const response = await resend.emails.send({
      from: `Rolled Out <magic@${Config.resend.domain}>`,
      to: payload.to,
      subject: "Sign in to Rolled Out",
      react: <MagicLinkEmail {...payload.props} />,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  },
};
