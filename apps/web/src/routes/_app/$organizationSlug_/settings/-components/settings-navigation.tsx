import * as Sidebar from "@components/layout/sidebar";
import { Clickable, Text } from "@mono/ui";
import { UserMenu } from "@routes/_app/-components/user-menu";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, SmartphoneIcon, UserIcon } from "lucide-react";

export const SettingsNavigation = () => {
  const { organizationSlug } = useParams({
    from: "/_app/$organizationSlug_/settings",
  });

  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Clickable.Root
          className="items-center gap-2 border-0"
          asChild
          variant="tertiary"
        >
          <Link to="/$organizationSlug" params={{ organizationSlug }}>
            <Clickable.Icon>
              <ArrowLeftIcon />
            </Clickable.Icon>
            <Text.Root size="sm" weight="medium">
              Back
            </Text.Root>
          </Link>
        </Clickable.Root>
        <Sidebar.Version />
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <div className="flex flex-col gap-4">
          <Sidebar.Group label="Account">
            <Sidebar.NavLink
              to="/$organizationSlug/settings/profile"
              params={{ organizationSlug }}
              label="Profile"
              icon={UserIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/settings/sessions"
              params={{ organizationSlug }}
              label="Devices & Sessions"
              icon={SmartphoneIcon}
            />
          </Sidebar.Group>
        </div>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="p-2">
        <UserMenu organizationSlug={organizationSlug} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
