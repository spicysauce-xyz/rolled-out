import { Body, Html, Link, Text } from "@react-email/components";

interface MagicLinkProps {
  link: string;
}

const MagicLinkEmail = ({ link }: MagicLinkProps) => {
  return (
    <Html style={{ fontFamily: "Inter, sans-serif" }}>
      <Body>
        <Text>Click the link below to sign in:</Text>
        <Link href={link} style={{ fontSize: "14px" }}>
          Sign In
        </Link>
        <Text>This link will expire in 5 minutes.</Text>
        <Text>If you didn’t request this, just ignore this email.</Text>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;
