import * as Sidebar from "@components/layout/sidebar";
import type { authClient } from "@lib/auth";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { UserMenu } from "@modules/shared/components/user-menu";
import {
  BellIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  PlusIcon,
  ScrollTextIcon,
  SettingsIcon,
} from "lucide-react";

interface DashboardNavigationProps {
  user: (typeof authClient.$Infer.Session)["user"];
  organizationSlug: string;
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  user,
  organizationSlug,
}) => {
  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Sidebar.Logo />
        <Sidebar.Version />
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <div className="flex flex-col gap-4">
          <Sidebar.Group>
            <Sidebar.NavLink
              to="/$organizationSlug"
              params={{ organizationSlug }}
              label="Analytics"
              icon={LineChartIcon}
              activeOptions={{ exact: true }}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/contacts"
              params={{ organizationSlug }}
              label="Subscribers"
              icon={MailIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/updates"
              params={{ organizationSlug }}
              label="Updates"
              icon={BellIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/settings/details"
              params={{ organizationSlug }}
              label="Settings"
              icon={SettingsIcon}
            />
          </Sidebar.Group>
          <Sidebar.Group label="Boards">
            <Sidebar.NavLink
              to="/$organizationSlug/board-1"
              params={{ organizationSlug }}
              label="Board 1"
              icon={ScrollTextIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/board-1"
              params={{ organizationSlug }}
              label="New Board"
              icon={PlusIcon}
            />
          </Sidebar.Group>
        </div>
        <Sidebar.Fill />
        <Sidebar.Group>
          <Sidebar.Link href="#" label="Feedback" icon={MessageCircleIcon} />
          <Sidebar.Link href="#" label="Changelog" icon={ListIcon} />
          <Sidebar.Link href="#" label="Support" icon={HelpCircleIcon} />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="flex gap-1 p-2">
        <UserMenu user={user} organizationSlug={organizationSlug} />
        <NotificationsList />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
