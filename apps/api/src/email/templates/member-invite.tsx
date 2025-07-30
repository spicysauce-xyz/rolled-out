import { Body, Html, Link, Text } from "@react-email/components";

interface MemberInviteProps {
  inviterName: string;
  organizationName: string;
}

const MemberInviteEmail = ({
  inviterName,
  organizationName,
}: MemberInviteProps) => {
  return (
    <Html style={{ fontFamily: "Inter, sans-serif" }}>
      <Body>
        <Text>
          {inviterName} invited you to join {organizationName} on RolledOut.
          Open the app to accept your invitation.
        </Text>
        <Link href="https://app.rolledout.xyz" style={{ fontSize: "14px" }}>
          Open the App
        </Link>
        <Text>This link will expire in 2 days.</Text>
      </Body>
    </Html>
  );
};

export default MemberInviteEmail;
