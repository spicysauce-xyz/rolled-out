import { Transition } from "@components/transition";
import { notificationsQuery, notificationsStatusQuery } from "@lib/api/queries";
import { IconButton, Popover, Text, Tooltip } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import { useMemo } from "react";
import { match } from "ts-pattern";
import { List } from "./list";
import { ListSkeleton } from "./skeleton";
import { useMarkAsReadOnClose } from "./use-mark-as-read-on-close";

export const NotificationsList: React.FC = () => {
  const popover = useDisclosure();

  const notificationsStatusData = useQuery(notificationsStatusQuery());

  const notificationsCount = notificationsStatusData.data?.count ?? 0;
  const unreadNotificationsCount =
    notificationsStatusData.data?.unreadCount ?? 0;

  const notificationsData = useInfiniteQuery({
    ...notificationsQuery(20),
    enabled: popover.isOpen,
  });

  const handleOpenChange = useMarkAsReadOnClose({ disclosure: popover });

  const tooltipTitle = useMemo(() => {
    if (unreadNotificationsCount > 0) {
      return `${unreadNotificationsCount} unread notification${
        unreadNotificationsCount > 1 ? "s" : ""
      }`;
    }
    if (notificationsCount === 0) {
      return "No notifications yet";
    }

    return "";
  }, [unreadNotificationsCount, notificationsCount]);

  return (
    <Popover.Root onOpenChange={handleOpenChange} open={popover.isOpen}>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Popover.Trigger asChild>
            <Tooltip.Trigger asChild>
              <IconButton.Root
                className="shrink-0 hover:bg-neutral-100 focus-visible:bg-neutral-100"
                isDisabled={notificationsCount === 0}
                isLoading={notificationsStatusData.isPending}
                onClick={popover.toggle}
                size="sm"
                variant="tertiary"
              >
                <IconButton.Icon className="relative">
                  <BellIcon />
                  {unreadNotificationsCount > 0 && (
                    <div className="-top-[2px] -right-[2px] absolute flex size-2.5 items-center justify-center rounded-full border-2 border-neutral-50 bg-accent-500 transition-colors group-hover/button-root:border-neutral-100" />
                  )}
                </IconButton.Icon>
              </IconButton.Root>
            </Tooltip.Trigger>
          </Popover.Trigger>
          {tooltipTitle && (
            <Tooltip.Content>
              <Tooltip.Title>{tooltipTitle}</Tooltip.Title>
            </Tooltip.Content>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>
      <Popover.Content
        align="start"
        className="flex w-96 flex-col px-0 py-0"
        side="top"
      >
        <div className="border-neutral-100 border-b p-4">
          <Text.Root weight="medium">Notifications</Text.Root>
        </div>

        <Transition.Root>
          {match(notificationsData)
            .with({ isPending: true }, () => (
              <Transition.Item
                className="flex flex-col overflow-hidden p-2"
                key="loader"
              >
                <ListSkeleton count={notificationsCount ?? 0} />
              </Transition.Item>
            ))
            .with({ isError: true }, () => null)
            .otherwise(
              ({ data, hasNextPage, isFetchingNextPage, fetchNextPage }) => (
                <Transition.Item key="list">
                  <List
                    data={data.pages.flat()}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    lastReadAt={notificationsStatusData.data?.lastReadAt}
                  />
                </Transition.Item>
              )
            )}
        </Transition.Root>
      </Popover.Content>
    </Popover.Root>
  );
};
