import { Transition } from "@components/transition";
import { Building02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { organizationsQuery } from "@lib/api/queries";
import { NewOrganizationDialog } from "@modules/dashboard/components/new-organization-dialog";
import { Avatar, Button, DropdownMenu, Skeleton, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import _ from "lodash";
import { match } from "ts-pattern";

export const OrganizationSwitch = () => {
  const { user, organization } = useRouteContext({
    from: "/_authorized/_has-organization/$organizationSlug",
  });

  const navigate = useNavigate();
  const router = useRouter();

  const organizations = useQuery(organizationsQuery(user.id));

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
        <DropdownMenu.Trigger
          render={<Button.Root className="flex-1 px-2" variant="tertiary" />}
        >
          <Button.Icon
            render={<HugeiconsIcon icon={Building02Icon} strokeWidth={2} />}
          />
          <span className="truncate">{organization.name}</span>
          <Button.Icon
            className="ml-auto"
            render={<HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
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
                          className="h-auto py-2"
                          closeOnClick
                          key={entry.id}
                          value={entry.slug}
                        >
                          <Avatar.Root className="size-10 rounded-sm">
                            <Avatar.Image src={entry.logo || ""} />
                            <Avatar.Fallback className="group-data-[highlighted]/dropdown-button:border-neutral-300">
                              {entry.name[0]}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <div className="flex flex-col items-start gap-0.5">
                            <Text.Root weight="medium">{entry.name}</Text.Root>
                            <Text.Root color="muted" size="sm">
                              Free plan · 1 member
                            </Text.Root>
                          </div>
                        </DropdownMenu.RadioItem>
                      ))}
                    </DropdownMenu.RadioGroup>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      className="justify-center"
                      render={<Link to="/account/organizations" />}
                    >
                      <div className="flex flex-1 justify-center gap-2">
                        Manage Organizations
                      </div>
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
