import type { api, SuccessResponse } from "@lib/api";
import { Skeleton, Text } from "@mono/ui";
import { formatDistance } from "date-fns";
import type { InferResponseType } from "hono";
import _ from "lodash";
import { useMemo } from "react";
import { InvitationMenu } from "./invite-menu";
import { MemberEntry } from "./member-entry";
import { MemberMenu } from "./member-menu";

type Member = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["members"]["$get"]
  >
>[number];

type Invitation = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["invitations"]["$get"]
  >
>[number];

interface MemberProps {
  data: Member;
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
          email={data.user.email}
          image={data.user.image}
          name={data.user.name}
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
  data: Invitation;
}

const Invitation: React.FC<InvitationProps> = ({ data, organizationId }) => {
  const statusColor = useMemo(() => {
    if (data.status === "pending") {
      return "warning";
    }
    if (data.status === "accepted") {
      return "success";
    }
    if (["rejected", "canceled"].includes(data.status)) {
      return "danger";
    }
    return "muted";
  }, [data.status]);

  return (
    <MemberEntry.Root key={data.id}>
      <MemberEntry.Group>
        <MemberEntry.Avatar email={data.email || ""} />
        <MemberEntry.Content>
          <MemberEntry.Heading>{data.email}</MemberEntry.Heading>
          <MemberEntry.Subheading>
            <Text.Root color={statusColor} render={<span />} size="sm">
              {_.capitalize(data.status)} Invitation
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
  data: (
    | { type: "member"; member: Member }
    | { type: "invitation"; invitation: Invitation }
  )[];
}
export const MembersList: React.FC<MembersListProps> & {
  Skeleton: React.FC;
} = ({ data, currentUserId, organizationId }) => {
  return data.map((item) => {
    if (item.type === "member") {
      return (
        <Member
          currentUserId={currentUserId}
          data={item.member}
          key={item.member.id}
          organizationId={organizationId}
        />
      );
    }

    return (
      <Invitation
        data={item.invitation}
        key={item.invitation.id}
        organizationId={organizationId}
      />
    );
  });
};

MembersList.Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {new Array(5).fill(null).map((__, index) => (
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
