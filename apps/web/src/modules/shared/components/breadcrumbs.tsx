import * as Transition from "@components/transition";
import { authClient } from "@lib/auth";
import { DropdownMenu, LinkButton, Skeleton, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { cn } from "@mono/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { last } from "lodash";
import {
  AlertTriangleIcon,
  ChevronsUpDownIcon,
  HomeIcon,
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

  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await authClient.organization.list();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleUpdateActiveOrganization = async (organizationSlug: string) => {
    const lastMatch = last(router.state.matches);

    if (!lastMatch) {
      return;
    }

    navigate({
      to: ".",
      params: { ...lastMatch.params, organizationSlug },
    });
  };

  const createOrganizationDialog = useDisclosure();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <LinkButton.Root>
            {organization.name}
            <LinkButton.Icon>
              <ChevronsUpDownIcon />
            </LinkButton.Icon>
          </LinkButton.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <Transition.Root>
            {match(organizationsQuery)
              .with({ isPending: true }, () => (
                <Transition.Item key="skeleton" className="flex flex-col gap-1">
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                  <Skeleton.Root className="mx-2 h-8.5 w-40 rounded-sm" />
                </Transition.Item>
              ))
              .with({ isError: true }, ({ isRefetching, refetch }) => (
                <Transition.Item key="error" className="flex flex-col">
                  <div className="flex h-9 items-center gap-2 px-4">
                    <AlertTriangleIcon className="size-4 stroke-danger-500" />
                    <Text.Root size="sm" weight="medium" color="danger">
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
                  <Transition.Item key="dropdown" className="flex flex-col">
                    <DropdownMenu.RadioGroup
                      value={organization.slug}
                      onValueChange={(value) =>
                        handleUpdateActiveOrganization(value)
                      }
                    >
                      {data.map((organization) => (
                        <DropdownMenu.RadioItem
                          key={organization.id}
                          value={organization.slug}
                        >
                          <DropdownMenu.ItemIcon>
                            <HomeIcon />
                          </DropdownMenu.ItemIcon>
                          {organization.name}
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
