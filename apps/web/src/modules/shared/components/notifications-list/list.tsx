import type { api, SuccessResponse } from "@lib/api";
import { ScrollArea, Skeleton } from "@mono/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import { isAfter } from "date-fns";
import type { InferResponseType } from "hono";
import { useEffect, useMemo, useRef } from "react";
import { OrganizationCreatedNotification } from "./notifications/organization-created";

type Notification = SuccessResponse<
  InferResponseType<(typeof api.notifications)["$get"]>
>[number];

interface ListProps {
  lastReadAt?: string | null;
  data: Notification[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const List = ({
  data,
  lastReadAt,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ListProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? data.length + 1 : data.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => 56,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: needed for infinite scroll
  const virtualizedItems = useMemo(
    () => rowVirtualizer.getVirtualItems(),
    [rowVirtualizer.getVirtualItems()]
  );

  useEffect(() => {
    const [lastItem] = [...virtualizedItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= data.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    data.length,
    isFetchingNextPage,
    virtualizedItems,
  ]);

  return (
    <ScrollArea.Root type="scroll">
      <ScrollArea.Viewport className="max-h-130 p-2" ref={viewportRef}>
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualizedItems.map((virtualItem) => {
            const notification = data[virtualItem.index];
            const isLoaderRow = virtualItem.index > data.length - 1;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="flex items-center gap-2 p-2">
                    <Skeleton.Root className="size-10 rounded-md" />
                    <div className="flex flex-col gap-2">
                      <Skeleton.Root className="h-3.5 w-60 rounded-xs" />
                      <Skeleton.Root className="h-3 w-40 rounded-xs" />
                    </div>
                  </div>
                ) : (
                  <OrganizationCreatedNotification
                    createdAt={notification.createdAt}
                    isUnread={
                      lastReadAt
                        ? isAfter(notification.createdAt, lastReadAt)
                        : true
                    }
                    key={notification.id}
                    organization={notification.organization}
                  />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
};
