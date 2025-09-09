import MagicLinkEmail from "@email/templates/magic-link";
import { Config } from "@services/config";
import { ResultAsync } from "neverthrow";
import { Resend } from "resend";
import MemberInviteEmail from "./templates/member-invite";

const resend = new Resend(Config.resend.apiKey);

interface EmailPayload<T> {
  to: string;
  subject?: string;
  props: T;
}

export const Email = {
  async sendMagicLinkEmail(
    payload: EmailPayload<React.ComponentPropsWithoutRef<typeof MagicLinkEmail>>
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
  sendMemberInviteEmail(
    payload: EmailPayload<
      React.ComponentPropsWithoutRef<typeof MemberInviteEmail>
    >
  ) {
    return ResultAsync.fromPromise(
      resend.emails.send({
        from: `Rolled Out <invite@${Config.resend.domain}>`,
        to: payload.to,
        subject: `You've been invited to join ${payload.props.organizationName} on Rolled Out`,
        react: <MemberInviteEmail {...payload.props} />,
      }),
      (error) =>
        new Error("Failed to send member invite email", { cause: error })
    );
  },
};
