import { Card } from "@components/card";
import { Transition } from "@components/transition";
import { organizationQuery } from "@lib/api/queries";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { Button } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus2Icon } from "lucide-react";
import { match } from "ts-pattern";
import { InviteMemberDialog } from "./components/invite-member-dialog";
import { MembersList } from "./components/members-list";
import { filterExpiredInvitations } from "./utils";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/members"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization, user } = Route.useRouteContext();

  const organizationData = useQuery(organizationQuery(organization.id));

  const inviteMemberDialog = useDisclosure();
  const inviteMemberPermission = useHasPermission({
    organizationId: organization.id,
    permission: {
      invitation: ["create"],
    },
  });

  return (
    <Card.Root>
      <Card.Header>
        <Card.HeaderCopy>
          <Card.HeaderTitle>Members</Card.HeaderTitle>
          <Card.HeaderDescription>
            Manage your organization members
          </Card.HeaderDescription>
        </Card.HeaderCopy>
      </Card.Header>
      <Card.Content>
        <Transition.Root>
          {match(organizationData)
            .with({ isPending: true }, () => (
              <Transition.Item key="loading">
                <MembersList.Skeleton />
              </Transition.Item>
            ))
            .with({ isError: true }, () => (
              <Transition.Item key="error">
                <div>Error</div>
              </Transition.Item>
            ))
            .otherwise(({ data }) => (
              <Transition.Item className="flex flex-col gap-4" key="list">
                <MembersList
                  currentUserId={user.id}
                  members={[
                    ...data.members,
                    ...filterExpiredInvitations(data.invitations),
                  ]}
                  organizationId={data.id}
                />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Card.Content>
      {inviteMemberPermission.hasPermission && (
        <Card.Footer>
          <Button.Root
            isDisabled={organizationData.isPending}
            onClick={inviteMemberDialog.open}
            variant="secondary"
          >
            <Button.Icon>
              <UserPlus2Icon />
            </Button.Icon>
            Invite Member
          </Button.Root>
          <InviteMemberDialog
            isOpen={inviteMemberDialog.isOpen}
            onOpenChange={inviteMemberDialog.setOpen}
            organizationId={organization.id}
          />
        </Card.Footer>
      )}
    </Card.Root>
  );
}
