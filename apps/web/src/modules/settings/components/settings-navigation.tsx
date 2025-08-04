import { Sidebar } from "@components/sidebar";
import type { authClient } from "@lib/auth";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Clickable, Text } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  BuildingIcon,
  NotebookTextIcon,
  SmartphoneIcon,
  User2Icon,
  Users2,
} from "lucide-react";

interface SettingsNavigationProps {
  organization: {
    name: string;
    slug: string;
    id: string;
  };
  user: (typeof authClient.$Infer.Session)["user"];
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  organization,
  user,
}) => {
  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Clickable.Root
          asChild
          className="items-center gap-2 border-0"
          variant="tertiary"
        >
          <Link
            params={{ organizationSlug: organization.slug }}
            to="/$organizationSlug"
          >
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
              icon={User2Icon}
              label="Profile"
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug/settings/profile"
            />
            <Sidebar.NavLink
              icon={BuildingIcon}
              label="Organizations"
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug/settings/organizations"
            />
            <Sidebar.NavLink
              icon={SmartphoneIcon}
              label="Devices & Sessions"
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug/settings/sessions"
            />
          </Sidebar.Group>
          <Sidebar.Group label={organization.name}>
            <Sidebar.NavLink
              icon={NotebookTextIcon}
              label="Details"
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug/settings/details"
            />
            <Sidebar.NavLink
              icon={Users2}
              label="Members"
              params={{ organizationSlug: organization.slug }}
              to="/$organizationSlug/settings/members"
            />
          </Sidebar.Group>
        </div>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="flex gap-1 p-2">
        <UserMenu organizationSlug={organization.slug} user={user} />
        <NotificationsList />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
