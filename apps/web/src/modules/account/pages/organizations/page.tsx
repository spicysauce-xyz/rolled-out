import { Card } from "@components/card";
import { Transition } from "@components/transition";
import { invitationsQuery, organizationsQuery } from "@lib/api/queries";
import { NewOrganizationDialog } from "@modules/dashboard/components/new-organization-dialog";
import { Button, Skeleton } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { match } from "ts-pattern";
import { InvitationItem } from "./components/invitation-item";
import { OrganizationItem } from "./components/organization-item";

export const Route = createFileRoute("/_authorized/account/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization: activeOrganizationSlug } = useSearch({
    from: "/_authorized/account",
  });

  const organizationsData = useQueries({
    queries: [organizationsQuery(), invitationsQuery()],
    combine(result) {
      return {
        data: [
          ...(result[0].data || []).map((item) => ({
            type: "organization" as const,
            organization: item,
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

  const newOrganizationModal = useDisclosure();

  return (
    <Card.Root>
      <Card.Header>
        <Card.HeaderCopy>
          <Card.HeaderTitle>Organizations</Card.HeaderTitle>
          <Card.HeaderDescription>
            Manage organizations you are a member of
          </Card.HeaderDescription>
        </Card.HeaderCopy>
      </Card.Header>
      <Card.Content>
        <Transition.Root>
          {match(organizationsData)
            .with({ isPending: true }, () => (
              <Transition.Item key="loading">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton.Root className="size-10 rounded-md" />
                    <div className="flex flex-col gap-2">
                      <Skeleton.Root className="h-3.5 w-40 rounded-xs" />
                      <Skeleton.Root className="h-3 w-28 rounded-xs" />
                    </div>
                  </div>
                </div>
              </Transition.Item>
            ))
            .with({ isError: true }, () => (
              <Transition.Item key="error">
                <div>Error</div>
              </Transition.Item>
            ))
            .otherwise(({ data }) => (
              <Transition.Item className="flex flex-col gap-4" key="list">
                {data.map((organizationOrInvitation) => {
                  if (organizationOrInvitation.type === "organization") {
                    return (
                      <OrganizationItem
                        data={organizationOrInvitation.organization}
                        isActive={
                          organizationOrInvitation.organization.slug ===
                          activeOrganizationSlug
                        }
                        key={organizationOrInvitation.organization.id}
                      />
                    );
                  }

                  return (
                    <InvitationItem
                      data={organizationOrInvitation.invitation}
                      key={organizationOrInvitation.invitation.id}
                    />
                  );
                })}
              </Transition.Item>
            ))}
        </Transition.Root>
      </Card.Content>
      <Card.Footer>
        <Button.Root onClick={newOrganizationModal.open} variant="secondary">
          <Button.Icon>
            <PlusIcon />
          </Button.Icon>
          New Organization
        </Button.Root>
      </Card.Footer>
      <NewOrganizationDialog
        isOpen={newOrganizationModal.isOpen}
        onOpenChange={newOrganizationModal.setOpen}
      />
    </Card.Root>
  );
}
