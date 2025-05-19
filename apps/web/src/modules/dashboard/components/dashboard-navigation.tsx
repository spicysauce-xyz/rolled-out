import * as Sidebar from "@components/layout/sidebar";
import { UserMenu } from "@modules/shared/components/user-menu";
import { useParams } from "@tanstack/react-router";
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

export const DashboardNavigation = () => {
  const { organizationSlug } = useParams({
    from: "/_authorized/$organizationSlug",
  });

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
              to="/$organizationSlug/settings"
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
      <Sidebar.Footer className="p-2">
        <UserMenu organizationSlug={organizationSlug} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
