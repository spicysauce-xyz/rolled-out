import * as Sidebar from "@components/layout/sidebar";
import { UserMenu } from "@modules/dashboard/components/user-menu";
import { IconButton, Text } from "@mono/ui";
import { useParams } from "@tanstack/react-router";
import {
  BellIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  PlusIcon,
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
            label="Contacts"
            icon={MailIcon}
          />
          <Sidebar.NavLink
            to="/$organizationSlug/updates"
            params={{ organizationSlug }}
            label="Updates"
            icon={BellIcon}
          />
          <div className="flex flex-col gap-1">
            <div className="group/sidebar-collapse flex items-center gap-1">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-md pl-2 transition-colors hover:bg-neutral-100">
                <div className="text-neutral-500">
                  <ChevronRightIcon className="size-4 rotate-90" />
                </div>
                <Text.Root size="sm" weight="medium" color="muted">
                  Boards
                </Text.Root>
              </div>
              <IconButton.Root
                variant="tertiary"
                size="sm"
                className="border-0 opacity-0 transition-[background-color,border-color,opacity] hover:bg-neutral-100 group-hover/sidebar-collapse:opacity-100"
              >
                <IconButton.Icon>
                  <PlusIcon />
                </IconButton.Icon>
              </IconButton.Root>
            </div>
            <div className="relative flex flex-col gap-1">
              <div className="-bottom-0 absolute top-0 left-4 w-px bg-neutral-200" />
              <div className="group/collapse-item flex h-9 items-center gap-2 rounded-md pr-2 pl-8">
                <div className="-translate-x-4 absolute h-9 w-px bg-neutral-950" />
                <Text.Root
                  size="sm"
                  weight="medium"
                  className="transition-colors group-hover/collapse-item:text-neutral-900"
                >
                  Board 1
                </Text.Root>
              </div>
              <div className="group/collapse-item flex h-9 items-center gap-2 rounded-md pr-2 pl-8">
                <Text.Root
                  size="sm"
                  weight="medium"
                  color="muted"
                  className="transition-colors group-hover/collapse-item:text-neutral-900"
                >
                  Board 1
                </Text.Root>
              </div>
              <div className="group/collapse-item flex h-9 items-center gap-2 rounded-md pr-2 pl-8">
                <Text.Root
                  size="sm"
                  weight="medium"
                  color="muted"
                  className="transition-colors group-hover/collapse-item:text-neutral-900"
                >
                  Board 1
                </Text.Root>
              </div>
            </div>
          </div>
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
