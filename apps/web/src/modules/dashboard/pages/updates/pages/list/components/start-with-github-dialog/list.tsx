import type { api, SuccessResponse } from "@lib/api";
import { ScrollArea } from "@mono/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { InferResponseType } from "hono";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Item } from "./item";

type Commit = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["repositories"][":repositoryId"]["commits"]["$get"]
  >
>[number];

type ListProps = {
  pages: { data: Commit[] }[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onCommitClick: (sha: string) => void;
  selectedCommits: string[];
};

export const List: React.FC<ListProps> = ({
  pages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onCommitClick,
  selectedCommits,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => pages.flatMap((page) => page.data), [pages]);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? data.length + 1 : data.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: (index) => 54 + (index === 0 ? 0 : 8),
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

  const getItemId = useCallback(
    (commit: { commitId: string } | { prId: string }) => {
      if ("commitId" in commit) {
        return commit.commitId;
      }

      return commit.prId;
    },
    []
  );

  return (
    <ScrollArea.Root className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className="h-128 w-full p-6" ref={viewportRef}>
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const commit = data[virtualItem.index];
            const isLoaderRow = virtualItem.index > data.length - 1;

            return (
              <div
                className="flex items-end"
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
                  <Item.Skeleton />
                ) : (
                  <Item
                    commit={commit}
                    id={getItemId(commit)}
                    isSelected={selectedCommits.includes(getItemId(commit))}
                    onClick={onCommitClick}
                  />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};
