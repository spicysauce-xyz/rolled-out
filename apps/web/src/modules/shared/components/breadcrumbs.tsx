import * as Transition from "@components/transition";
import { authClient } from "@lib/auth";
import { DropdownMenu, LinkButton, Skeleton, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { last } from "lodash";
import { ChevronsUpDownIcon, HomeIcon, PlusIcon } from "lucide-react";
import { match } from "ts-pattern";

interface BreadcrumbsProps {
  organizationId: string;
  page: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  organizationId,
  page,
}) => {
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

  return (
    <div className="flex items-center gap-4">
      <Transition.Root>
        {match(organizationsQuery)
          .with({ isPending: true }, () => (
            <Transition.Item key="skeleton">
              <Skeleton.Root className="h-4 w-30 rounded-sm" />
            </Transition.Item>
          ))
          .with({ isError: true }, () => (
            <Transition.Item key="error">
              <Text.Root size="sm" weight="medium">
                Failed to load organizations
              </Text.Root>
            </Transition.Item>
          ))
          .otherwise(({ data }) => {
            const selectedOrganization = data.find(
              (organization) => organization.id === organizationId,
            );

            if (!selectedOrganization) {
              return null;
            }

            return (
              <Transition.Item key="dropdown" className="flex">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <LinkButton.Root>
                      {selectedOrganization.name}
                      <LinkButton.Icon>
                        <ChevronsUpDownIcon />
                      </LinkButton.Icon>
                    </LinkButton.Root>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="start">
                    <DropdownMenu.RadioGroup
                      value={selectedOrganization.slug}
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
                    <DropdownMenu.Item>
                      <DropdownMenu.ItemIcon>
                        <PlusIcon />
                      </DropdownMenu.ItemIcon>
                      New Organization
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Transition.Item>
            );
          })}
      </Transition.Root>
      <div className="h-4 w-px bg-neutral-200" />
      <Text.Root size="sm" weight="medium">
        {page}
      </Text.Root>
    </div>
  );
};
