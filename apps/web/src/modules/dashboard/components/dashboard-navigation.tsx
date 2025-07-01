import * as Sidebar from "@components/layout/sidebar";
import * as Transition from "@components/transition";
import { boardsQuery } from "@lib/api/queries";
import type { authClient } from "@lib/auth";
import { NewBoardDialog } from "@modules/shared/components/new-board-dialog";
import { NotificationsList } from "@modules/shared/components/notifications-list";
import { UserMenu } from "@modules/shared/components/user-menu";
import { Clickable, IconButton, Skeleton } from "@mono/ui";
import { Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { cn } from "@mono/ui/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  BellIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  LineChartIcon,
  ListIcon,
  MailIcon,
  MessageCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
} from "lucide-react";
// @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
import type { IconName } from "lucide-react/dynamic.mjs";
import { match } from "ts-pattern";

interface DashboardNavigationProps {
  user: (typeof authClient.$Infer.Session)["user"];
  organizationSlug: string;
  organizationId: string;
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  user,
  organizationSlug,
  organizationId,
}) => {
  const boardsData = useQuery(boardsQuery(organizationId));
  const newBoardDialog = useDisclosure();

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
              label="Updates"
              icon={BellIcon}
              activeOptions={{ exact: true }}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/contacts"
              params={{ organizationSlug }}
              label="Subscribers"
              icon={MailIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/analytics"
              params={{ organizationSlug }}
              label="Analytics"
              icon={LineChartIcon}
              activeOptions={{ exact: true }}
            />
          </Sidebar.Group>
          <Sidebar.Group label="Boards">
            <NewBoardDialog
              isOpen={newBoardDialog.isOpen}
              onOpenChange={newBoardDialog.setOpen}
              organizationId={organizationId}
            />
            <Transition.Root>
              {match(boardsData)
                .with({ isPending: true }, () => (
                  <Transition.Item
                    key="loader"
                    className="flex flex-col gap-1 px-2"
                  >
                    <Skeleton.Root className="h-9 w-full" />
                    <Skeleton.Root className="h-9 w-full" />
                    <Skeleton.Root className="h-9 w-full" />
                  </Transition.Item>
                ))
                .with({ isError: true }, ({ refetch, isRefetching }) => (
                  <Transition.Item key="error" className="flex flex-col gap-1">
                    <div className="flex h-9 items-center gap-2 pl-2">
                      <AlertTriangleIcon className="size-4 stroke-danger-500" />
                      <div className="flex flex-1 flex-col">
                        <Text.Root size="sm" weight="medium" color="danger">
                          Failed to load boards
                        </Text.Root>
                      </div>
                      <IconButton.Root
                        variant="tertiary"
                        color="neutral"
                        className="shrink-0 hover:bg-neutral-100 focus-visible:bg-neutral-100"
                        size="sm"
                        onClick={() => refetch()}
                      >
                        <IconButton.Icon>
                          <RefreshCwIcon
                            className={cn(
                              "size-4",
                              isRefetching && "animate-spin",
                            )}
                          />
                        </IconButton.Icon>
                      </IconButton.Root>
                    </div>
                  </Transition.Item>
                ))
                .otherwise(({ data }) => (
                  <Transition.Item key="boards" className="flex flex-col gap-1">
                    {data.map((board) => (
                      <Sidebar.NavLink
                        key={board.id}
                        to="/$organizationSlug/boards/$id"
                        params={{ organizationSlug, id: board.id }}
                        label={board.name}
                        iconName={board.symbol as IconName}
                      >
                        {board.postCount > 0 && (
                          <Clickable.Icon className="ml-auto">
                            <Text.Root size="sm" className="text-inherit">
                              {board.postCount}
                            </Text.Root>
                          </Clickable.Icon>
                        )}
                      </Sidebar.NavLink>
                    ))}
                    <Sidebar.Button
                      label="New Board"
                      icon={PlusIcon}
                      onClick={newBoardDialog.open}
                    />
                  </Transition.Item>
                ))}
            </Transition.Root>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.NavLink
              to="/$organizationSlug/settings/details"
              params={{ organizationSlug }}
              label="Settings"
              icon={SettingsIcon}
            />
            <Sidebar.NavLink
              to="/$organizationSlug/settings/details"
              params={{ organizationSlug }}
              label="Preview"
              icon={ExternalLinkIcon}
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
