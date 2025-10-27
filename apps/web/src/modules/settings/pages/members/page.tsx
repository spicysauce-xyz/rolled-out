import { Card } from "@components/card";
import { Transition } from "@components/transition";
import { UserAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { invitationsQuery, membersQuery } from "@lib/api/queries";
import { useHasPermission } from "@modules/shared/hooks/use-has-permission";
import { Button } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { InviteMemberDialog } from "../../../shared/components/invite-member-dialog";
import { MembersList } from "./components/members-list";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/members"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization, user } = Route.useRouteContext();

  const membersData = useQueries({
    queries: [membersQuery(organization.id), invitationsQuery(organization.id)],
    combine: (result) => {
      return {
        data: [
          ...(result[0].data || []).map((item) => ({
            type: "member" as const,
            member: item,
          })),
          ...(result[1].data || []).map((item) => ({
            type: "invitation" as const,
            invitation: item,
          })),
        ],
        isPending: result[0].isPending || result[1].isPending,
        isError: result[0].isError || result[1].isError,
      };
    },
  });

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
          {match(membersData)
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
                  data={data}
                  organizationId={organization.id}
                />
              </Transition.Item>
            ))}
        </Transition.Root>
      </Card.Content>
      {inviteMemberPermission.hasPermission && (
        <Card.Footer>
          <Button.Root
            isDisabled={membersData.isPending}
            onClick={inviteMemberDialog.open}
            variant="secondary"
          >
            <Button.Icon
              render={<HugeiconsIcon icon={UserAdd02Icon} strokeWidth={2} />}
            />
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
