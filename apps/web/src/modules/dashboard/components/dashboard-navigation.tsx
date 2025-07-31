import { Sidebar } from "@components/sidebar";
import type { authClient } from "@lib/auth";
import { getPublicUrl } from "@modules/dashboard/utils";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { UserMenu } from "@modules/shared/components/user-menu";
import {
  BellIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
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
        <Sidebar.Group>
          <Sidebar.NavLink
            activeOptions={{ exact: true }}
            icon={BellIcon}
            label="Updates"
            params={{ organizationSlug }}
            to="/$organizationSlug"
          />
          <Sidebar.NavLink
            icon={MailIcon}
            isDisabled
            label="Subscribers"
            params={{ organizationSlug }}
            to="/$organizationSlug/contacts"
          />
          <Sidebar.NavLink
            icon={LineChartIcon}
            isDisabled
            label="Analytics"
            params={{ organizationSlug }}
            to="/$organizationSlug/analytics"
          />
          <Sidebar.NavLink
            icon={SettingsIcon}
            label="Settings"
            params={{ organizationSlug }}
            to="/$organizationSlug/settings/details"
          />
          <Sidebar.Link
            href={getPublicUrl(organizationSlug)}
            icon={ExternalLinkIcon}
            label="Preview"
            rel="noopener noreferrer"
            target="_blank"
          />
        </Sidebar.Group>
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
          <Sidebar.Link href="#" icon={MessageCircleIcon} label="Feedback" />
          <Sidebar.Link href="#" icon={ListIcon} label="Changelog" />
          <Sidebar.Link href="#" icon={HelpCircleIcon} label="Support" />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="flex gap-1 p-2">
        <UserMenu organizationSlug={organizationSlug} user={user} />
        <NotificationsList />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
