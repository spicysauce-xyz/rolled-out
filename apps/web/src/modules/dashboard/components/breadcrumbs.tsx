import { Transition } from "@components/transition";
import { organizationsQuery } from "@lib/api/queries";
import type { authClient } from "@lib/auth";
import { Avatar, DropdownMenu, LinkButton, Skeleton, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { cn } from "@mono/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import _ from "lodash";
import {
  AlertTriangleIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { match } from "ts-pattern";
import { NewOrganizationDialog } from "./new-organization-dialog";

interface OrganizationSelectorProps {
  organization: typeof authClient.$Infer.Organization;
}

const OrganizationSelector = ({ organization }: OrganizationSelectorProps) => {
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
          <LinkButton.Root>
            <Avatar.Root className="mr-1 size-5 rounded-sm">
              <Avatar.Image src={organization.logo || ""} />
              <Avatar.Fallback className="text-xs">
                {organization.name[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            {organization.name}
            <LinkButton.Icon className="ml-1">
              <ChevronsUpDownIcon />
            </LinkButton.Icon>
          </LinkButton.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <Transition.Root>
            {match(organizations)
              .with({ isPending: true }, () => (
                <Transition.Item className="flex flex-col gap-1" key="skeleton">
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                </Transition.Item>
              ))
              .with({ isError: true }, ({ isRefetching, refetch }) => (
                <Transition.Item className="flex flex-col" key="error">
                  <div className="flex h-9 items-center gap-2 px-4">
                    <AlertTriangleIcon className="size-4 stroke-danger-500" />
                    <Text.Root color="danger" size="sm" weight="medium">
                      Failed to load organizations
                    </Text.Root>
                  </div>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    disabled={isRefetching}
                    onClick={(e) => {
                      e.preventDefault();
                      refetch();
                    }}
                  >
                    <DropdownMenu.ItemIcon>
                      <RefreshCcwIcon
                        className={cn("size-4", isRefetching && "animate-spin")}
                      />
                    </DropdownMenu.ItemIcon>
                    Retry
                  </DropdownMenu.Item>
                </Transition.Item>
              ))
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
                          key={entry.id}
                          value={entry.slug}
                        >
                          <Avatar.Root className="size-5 rounded-sm">
                            <Avatar.Image src={entry.logo || ""} />
                            <Avatar.Fallback className="text-xs">
                              {entry.name[0]}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          {entry.name}
                        </DropdownMenu.RadioItem>
                      ))}
                    </DropdownMenu.RadioGroup>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onClick={createOrganizationDialog.open}>
                      <DropdownMenu.ItemIcon>
                        <PlusIcon />
                      </DropdownMenu.ItemIcon>
                      New Organization
                    </DropdownMenu.Item>
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

interface BreadcrumbsProps {
  organization: typeof authClient.$Infer.Organization;
  page: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  organization,
  page,
}) => {
  return (
    <div className="flex items-center gap-4">
      <OrganizationSelector organization={organization} />
      <div className="h-4 w-px bg-neutral-200" />
      <Text.Root size="sm" weight="medium">
        {page}
      </Text.Root>
    </div>
  );
};
