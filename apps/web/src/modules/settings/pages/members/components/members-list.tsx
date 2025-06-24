import type { authClient } from "@lib/auth";
import { Skeleton, Text } from "@mono/ui";
import { formatDistance } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { InvitationMenu } from "./invite-menu";
import * as MemberEntry from "./member-entry";
import { MemberMenu } from "./member-menu";

interface MemberProps {
  data: (typeof authClient.$Infer.ActiveOrganization)["members"][number];
  currentUserId?: string;
  organizationId: string;
}

const Member: React.FC<MemberProps> = ({
  data,
  currentUserId,
  organizationId,
}) => {
  const isCurrentUser = data.userId === currentUserId;

  return (
    <MemberEntry.Root key={data.id}>
      <MemberEntry.Group>
        <MemberEntry.Avatar
          name={data.user.name}
          email={data.user.email}
          image={data.user.image}
        >
          {isCurrentUser && <MemberEntry.AvatarBadge label="You" />}
        </MemberEntry.Avatar>
        <MemberEntry.Content>
          <MemberEntry.Heading>{data.user.name}</MemberEntry.Heading>
          <MemberEntry.Subheading>
            {_.capitalize(data.role)} · {data.user.email}
          </MemberEntry.Subheading>
        </MemberEntry.Content>
      </MemberEntry.Group>
      {!isCurrentUser && (
        <MemberMenu member={data} organizationId={organizationId} />
      )}
    </MemberEntry.Root>
  );
};

interface InvitationProps {
  organizationId: string;
  data: (typeof authClient.$Infer.ActiveOrganization)["invitations"][number];
}

const Invitation: React.FC<InvitationProps> = ({ data, organizationId }) => {
  const statusColor = useMemo(() => {
    if (data.status === "pending") return "warning";
    if (data.status === "accepted") return "success";
    if (["rejected", "canceled"].includes(data.status)) return "danger";
    return "muted";
  }, [data.status]);

  return (
    <MemberEntry.Root key={data.id}>
      <MemberEntry.Group>
        <MemberEntry.Avatar email={data.email} />
        <MemberEntry.Content>
          <MemberEntry.Heading>{data.email}</MemberEntry.Heading>
          <MemberEntry.Subheading>
            <Text.Root size="xs" color={statusColor} asChild>
              <span>{_.capitalize(data.status)} Invitation</span>
            </Text.Root>{" "}
            · Expires in {formatDistance(data.expiresAt, new Date())}
          </MemberEntry.Subheading>
        </MemberEntry.Content>
      </MemberEntry.Group>
      <InvitationMenu invitation={data} organizationId={organizationId} />
    </MemberEntry.Root>
  );
};

interface MembersListProps {
  currentUserId?: string;
  organizationId: string;
  members: (
    | (typeof authClient.$Infer.ActiveOrganization)["members"][number]
    | (typeof authClient.$Infer.ActiveOrganization)["invitations"][number]
  )[];
}
export const MembersList: React.FC<MembersListProps> & {
  Skeleton: React.FC;
} = ({ members, currentUserId, organizationId }) => {
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      if ("userId" in member) return true;
      return member.status === "pending";
    });
  }, [members]);

  return filteredMembers.map((member) => {
    if ("userId" in member) {
      return (
        <Member
          key={member.id}
          data={member}
          currentUserId={currentUserId}
          organizationId={organizationId}
        />
      );
    }

    return (
      <Invitation
        key={member.id}
        data={member}
        organizationId={organizationId}
      />
    );
  });
};

MembersList.Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {new Array(5).fill(null).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
        <div className="flex items-center gap-2" key={index}>
          <Skeleton.Root className="size-10 rounded-md" />
          <div className="flex flex-col gap-2">
            <Skeleton.Root className="h-3.5 w-28 rounded-xs" />
            <Skeleton.Root className="h-3 w-40 rounded-xs" />
          </div>
        </div>
      ))}
    </div>
  );
};
