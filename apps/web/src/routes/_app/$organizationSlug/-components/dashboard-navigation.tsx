import * as Sidebar from "@components/layout/sidebar";
import { UserMenu } from "@routes/_app/-components/user-menu";
import { useParams } from "@tanstack/react-router";
import {
  BellIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  SettingsIcon,
} from "lucide-react";

export const DashboardNavigation = () => {
  const { organizationSlug } = useParams({
    from: "/_app/$organizationSlug",
  });

  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <Sidebar.Logo />
        <Sidebar.Version />
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.NavLink
            to="/$organizationSlug"
            params={{ organizationSlug }}
            label="Analytics"
            icon={LineChartIcon}
            activeOptions={{ exact: true }}
          />
          <Sidebar.NavLink
            to="/$organizationSlug/updates"
            params={{ organizationSlug }}
            label="Updates"
            icon={BellIcon}
          />
          <Sidebar.NavLink
            to="/$organizationSlug/contacts"
            params={{ organizationSlug }}
            label="Contacts"
            icon={MailIcon}
          />
          <Sidebar.NavLink
            to="/$organizationSlug/settings"
            params={{ organizationSlug }}
            label="Settings"
            icon={SettingsIcon}
          />
        </Sidebar.Group>
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
