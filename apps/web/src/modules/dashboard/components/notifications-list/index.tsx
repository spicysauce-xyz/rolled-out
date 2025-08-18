import { useRender } from "@base-ui-components/react/use-render";
import { Transition } from "@components/transition";
import { notificationsQuery, notificationsStatusQuery } from "@lib/api/queries";
import { Popover, Text } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { List } from "./list";
import { ListSkeleton } from "./skeleton";
import { useMarkAsReadOnClose } from "./use-mark-as-read-on-close";

type State = {
  unreadNotificationsCount: number;
  isPending: boolean;
};

interface NotificationsListProps
  extends useRender.ComponentProps<"button", State> {
  organizationId: string;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  organizationId,
  render = <button type="button" />,
  ...props
}) => {
  const popover = useDisclosure();

  const notificationsStatusData = useQuery(
    notificationsStatusQuery(organizationId)
  );

  const notificationsCount = notificationsStatusData.data?.count ?? 0;
  const unreadNotificationsCount =
    notificationsStatusData.data?.unreadCount ?? 0;

  const notificationsData = useInfiniteQuery({
    ...notificationsQuery(organizationId, 20),
    enabled: popover.isOpen,
  });

  const handleOpenChange = useMarkAsReadOnClose({
    organizationId,
    disclosure: popover,
  });

  const element = useRender({
    render,
    props,
    state: {
      unreadNotificationsCount,
      isPending: notificationsStatusData.isPending,
    },
    enabled: true,
  }) as React.ReactElement<State>;

  return (
    <Popover.Root onOpenChange={handleOpenChange} open={popover.isOpen}>
      <Popover.Trigger render={element} />
      <Popover.Content className="flex w-96 flex-col px-0 py-0" side="right">
        <div className="border-neutral-100 border-b p-4">
          <Text.Root size="lg" weight="medium">
            Notifications
          </Text.Root>
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
