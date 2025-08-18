import { Sidebar } from "@components/sidebar";
import { Transition } from "@components/transition";
import type { authClient } from "@lib/auth";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { OrganizationSwitch } from "@modules/shared/components/organization-switch";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Link } from "@tanstack/react-router";
import {
  BellIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserPlus2Icon,
} from "lucide-react";
import { getPublicUrl } from "../utils";

interface DashboardNavigationProps {
  user: (typeof authClient.$Infer.Session)["user"];
  organization: {
    id: string;
    name: string;
    logo: string | null;
    slug: string;
  };
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  user,
  organization,
}) => {
  return (
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header className="flex">
        <OrganizationSwitch organization={organization} />
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <div className="flex flex-col gap-4">
          <Sidebar.Group>
            <Sidebar.Button
              icon={FileTextIcon}
              label="Updates"
              render={
                <Link
                  activeOptions={{ exact: true }}
                  className="data-[status=active]:border data-[status=active]:border-neutral-100 data-[status=active]:bg-white data-[status=active]:[&>svg]:stroke-neutral-900"
                  params={{ organizationSlug: organization.slug }}
                  to="/$organizationSlug"
                />
              }
            />
            <Sidebar.Button
              disabled
              icon={MailIcon}
              label="Subscribers"
              render={
                <Link
                  activeOptions={{ exact: true }}
                  className="data-[status=active]:text-accent-500 data-[status=active]:[&>svg]:stroke-accent-500"
                  params={{ organizationSlug: organization.slug }}
                  to="/$organizationSlug/contacts"
                />
              }
            />
            <Sidebar.Button
              disabled
              icon={LineChartIcon}
              label="Analytics"
              render={
                <Link
                  activeOptions={{ exact: true }}
                  params={{ organizationSlug: organization.slug }}
                  to="/$organizationSlug/analytics"
                />
              }
            />
          </Sidebar.Group>
          <Sidebar.Group label="Workspace">
            <NotificationsList
              organizationId={organization.id}
              render={(_, { unreadNotificationsCount }) => (
                <Sidebar.Button icon={BellIcon} label="Notifications">
                  <Transition.Root>
                    {unreadNotificationsCount > 0 && (
                      <Transition.Item
                        className="ml-auto flex size-4 items-center justify-center rounded-xs bg-accent-500 text-white text-xs"
                        key="unread-notifications-count"
                      >
                        {unreadNotificationsCount}
                      </Transition.Item>
                    )}
                  </Transition.Root>
                </Sidebar.Button>
              )}
            />
            <Sidebar.Button icon={UserPlus2Icon} label="Invite Member" />
            <Sidebar.Button
              icon={ExternalLinkIcon}
              label="My Board"
              render={
                <a
                  href={getPublicUrl(organization.slug)}
                  rel="noopener noreferrer"
                  target="_blank"
                />
              }
            />
            <Sidebar.Button
              icon={SettingsIcon}
              label="Settings"
              render={
                <Link
                  activeOptions={{ exact: true }}
                  params={{ organizationSlug: organization.slug }}
                  to="/$organizationSlug/settings/details"
                />
              }
            />
          </Sidebar.Group>
        </div>
        {/* <Sidebar.Group label="Boards">
            <NewBoardDialog
              isOpen={newBoardDialog.isOpen}
              onOpenChange={newBoardDialog.setOpen}
              organizationId={organizationId}
            />
            <Transition.Root>
              {match(boardsData)
                .with({ isPending: true }, () => (
                  <Transition.Item
                    className="flex flex-col gap-1 px-2"
                    key="loader"
                  >
                    <Skeleton.Root className="h-9 w-full" />
                    <Skeleton.Root className="h-9 w-full" />
                    <Skeleton.Root className="h-9 w-full" />
                  </Transition.Item>
                ))
                .with({ isError: true }, ({ refetch, isRefetching }) => (
                  <Transition.Item className="flex flex-col gap-1" key="error">
                    <div className="flex h-9 items-center gap-2 pl-2">
                      <AlertTriangleIcon className="size-4 stroke-danger-500" />
                      <div className="flex flex-1 flex-col">
                        <Text.Root color="danger" size="sm" weight="medium">
                          Failed to load boards
                        </Text.Root>
                      </div>
                      <IconButton.Root
                        className="shrink-0 hover:bg-neutral-100 focus-visible:bg-neutral-100"
                        color="neutral"
                        onClick={() => refetch()}
                        size="sm"
                        variant="tertiary"
                      >
                        <IconButton.Icon>
                          <RefreshCwIcon
                            className={cn(
                              "size-4",
                              isRefetching && "animate-spin"
                            )}
                          />
                        </IconButton.Icon>
                      </IconButton.Root>
                    </div>
                  </Transition.Item>
                ))
                .otherwise(({ data }) => (
                  <Transition.Item className="flex flex-col gap-1" key="boards">
                    {data.map((board) => (
                      <Sidebar.NavLink
                        iconName={board.symbol as IconName}
                        key={board.id}
                        label={board.name}
                        params={{ organizationSlug, id: board.id }}
                        to="/$organizationSlug/boards/$id"
                      >
                        {board.postCount > 0 && (
                          <Clickable.Icon className="ml-auto">
                            <Text.Root className="text-inherit" size="sm">
                              {board.postCount}
                            </Text.Root>
                          </Clickable.Icon>
                        )}
                      </Sidebar.NavLink>
                    ))}
                    <Sidebar.Button
                      icon={PlusIcon}
                      label="New Board"
                      onClick={newBoardDialog.open}
                    />
                  </Transition.Item>
                ))}
            </Transition.Root>
          </Sidebar.Group> */}
        <Sidebar.Fill />
        <Sidebar.Group>
          <Sidebar.Button
            icon={MessageCircleIcon}
            label="Feedback"
            render={<a href="/" />}
          >
            <ExternalLinkIcon className="ml-auto" />
          </Sidebar.Button>
          <Sidebar.Button
            icon={ListIcon}
            label="Changelog"
            render={<a href="/" />}
          >
            <ExternalLinkIcon className="ml-auto" />
          </Sidebar.Button>
          <Sidebar.Button
            icon={HelpCircleIcon}
            label="Support"
            render={<a href="/" />}
          >
            <ExternalLinkIcon className="ml-auto" />
          </Sidebar.Button>
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="flex gap-1">
        <UserMenu currentOrganizationSlug={organization.slug} user={user} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
