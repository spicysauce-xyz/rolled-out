import * as Card from "@components/card";
import * as Transition from "@components/transition";
import { organizationQuery } from "@lib/api/queries";
import { useHasPermission } from "@modules/shared/hooks/useHasPermission";
import { Button } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus2Icon } from "lucide-react";
import { match } from "ts-pattern";
import { InviteMemberDialog } from "./components/invite-member-dialog";
import { MembersList } from "./components/members-list";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/members",
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
              <Transition.Item key="list" className="flex flex-col gap-4">
                <MembersList
                  members={[...data.members, ...data.invitations]}
                  currentUserId={user.id}
                  organizationId={data.id}
                />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Card.Content>
      {inviteMemberPermission.hasPermission && (
        <Card.Footer>
          <Button.Root
            onClick={inviteMemberDialog.open}
            isDisabled={organizationData.isPending}
            variant="secondary"
          >
            <Button.Icon>
              <UserPlus2Icon />
            </Button.Icon>
            Invite Member
          </Button.Root>
          <InviteMemberDialog
            organizationId={organization.id}
            isOpen={inviteMemberDialog.isOpen}
            onOpenChange={inviteMemberDialog.setOpen}
          />
        </Card.Footer>
      )}
    </Card.Root>
  );
}
