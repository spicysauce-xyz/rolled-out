import * as Sidebar from "@components/layout/sidebar";
import type { authClient } from "@lib/auth";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Clickable, Text } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  NotebookTextIcon,
  SmartphoneIcon,
  User2Icon,
  Users2,
} from "lucide-react";

interface SettingsNavigationProps {
  organizationName: string;
  organizationSlug: string;
  user: (typeof authClient.$Infer.Session)["user"];
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  organizationName,
  organizationSlug,
  user,
}) => {
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
              icon={User2Icon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/settings/sessions"
              params={{ organizationSlug }}
              label="Devices & Sessions"
              icon={SmartphoneIcon}
            />
          </Sidebar.Group>
          <Sidebar.Group label={organizationName}>
            <Sidebar.NavLink
              to="/$organizationSlug/settings/details"
              params={{ organizationSlug }}
              label="Details"
              icon={NotebookTextIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/settings/members"
              params={{ organizationSlug }}
              label="Members"
              icon={Users2}
            />
          </Sidebar.Group>
        </div>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="flex gap-1 p-2">
        <UserMenu user={user} organizationSlug={organizationSlug} />
        <NotificationsList />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
