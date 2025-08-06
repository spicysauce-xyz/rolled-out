import { Transition } from "@components/transition";
import { organizationsQuery } from "@lib/api/queries";
import { NewOrganizationDialog } from "@modules/dashboard/components/new-organization-dialog";
import { Avatar, Clickable, DropdownMenu, Skeleton, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import _ from "lodash";
import { BuildingIcon, ChevronsUpDownIcon } from "lucide-react";
import { match } from "ts-pattern";

interface OrganizationSwitchProps {
  organization: {
    name: string;
    logo: string | null;
    slug: string;
  };
}

export const OrganizationSwitch = ({
  organization,
}: OrganizationSwitchProps) => {
  const navigate = useNavigate();
  const router = useRouter();

  const organizations = useQuery(organizationsQuery());

  const handleUpdateActiveOrganization = async (organizationSlug: string) => {
    const lastMatch = _.last(router.state.matches);

    if (!lastMatch) {
      return;
    }

    await navigate({
      to: ".",
      params: { ...lastMatch.params, organizationSlug },
    });

    await router.invalidate({ sync: true });
  };

  const createOrganizationDialog = useDisclosure();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Clickable.Root
            className="flex h-9 w-full items-center justify-start gap-2 px-2 hover:bg-neutral-100 focus-visible:bg-neutral-100"
            variant="tertiary"
          >
            <BuildingIcon className="size-4 shrink-0 text-neutral-900" />
            <Text.Root className="truncate" size="sm" weight="medium">
              {organization.name}
            </Text.Root>
            <Clickable.Icon className="ml-auto">
              <ChevronsUpDownIcon />
            </Clickable.Icon>
          </Clickable.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" side="bottom">
          <Transition.Root>
            {match(organizations)
              .with({ isPending: true }, () => (
                <Transition.Item className="flex flex-col gap-1" key="skeleton">
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                </Transition.Item>
              ))
              .with({ isError: true }, () => null)
              .otherwise(({ data }) => {
                return (
                  <Transition.Item className="flex flex-col" key="dropdown">
                    <DropdownMenu.RadioGroup
                      onValueChange={(value) =>
                        handleUpdateActiveOrganization(value)
                      }
                      value={organization.slug}
                    >
                      {data.map((entry) => (
                        <DropdownMenu.RadioItem
                          className="h-auto"
                          key={entry.id}
                          value={entry.slug}
                        >
                          <Avatar.Root className="size-10 rounded-sm">
                            <Avatar.Image src={entry.logo || ""} />
                            <Avatar.Fallback className="text-xs">
                              {entry.name[0]}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <div className="flex flex-col items-start gap-0.5">
                            <Text.Root size="sm" weight="medium">
                              {entry.name}
                            </Text.Root>
                            <Text.Root color="muted" size="xs">
                              Free plan · 1 member
                            </Text.Root>
                          </div>
                        </DropdownMenu.RadioItem>
                      ))}
                    </DropdownMenu.RadioGroup>
                  </Transition.Item>
                );
              })}
          </Transition.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <NewOrganizationDialog
        isOpen={createOrganizationDialog.isOpen}
        onOpenChange={createOrganizationDialog.setOpen}
      />
    </>
  );
};
