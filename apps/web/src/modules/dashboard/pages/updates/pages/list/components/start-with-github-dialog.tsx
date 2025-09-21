import { Transition } from "@components/transition";
import { api, type SuccessResponse } from "@lib/api";
import { Avatar, Checkbox, Dialog, ScrollArea, Skeleton, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format } from "date-fns";
import type { InferResponseType } from "hono/client";
import { GitCommitVerticalIcon, GitPullRequestIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { match, P } from "ts-pattern";

const ItemSkeleton: React.FC = () => {
  return (
    <div className="flex h-[54px] w-full items-center gap-4 rounded-md border border-neutral-100 bg-white p-4">
      <Skeleton.Root className="size-4 rounded-sm" />
      <Skeleton.Root className="h-3.5 max-w-60 flex-1 rounded-xs" />
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Skeleton.Root className="size-5 rounded-full" />
          <Skeleton.Root className="h-3.5 w-16 rounded-xs" />
        </div>
        <Text.Root className="text-neutral-200">·</Text.Root>
        <Skeleton.Root className="h-3.5 w-7 rounded-xs" />
      </div>
    </div>
  );
};

type Commit = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["integrations"]["github"]["$get"]
  >
>[number];

type ListProps = {
  pages: { data: Commit[] }[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onCommitClick: (sha: string) => void;
  selectedCommits: string[];
  viewportRef: React.RefObject<HTMLDivElement | null>;
};

const List: React.FC<ListProps> = ({
  pages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onCommitClick,
  selectedCommits,
  viewportRef,
}) => {
  const data = useMemo(() => pages.flatMap((page) => page.data), [pages]);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? data.length + 1 : data.length,
    getScrollElement: () => {
      console.log("calling getScrollElement", viewportRef);

      return viewportRef.current;
    },
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

  console.log({ rowVirtualizer });

  return (
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
              <ItemSkeleton />
            ) : (
              <button
                className={cn(
                  "flex w-full items-center gap-4 rounded-md border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50",
                  selectedCommits.includes(commit.sha) &&
                    "bg-neutral-100 hover:bg-neutral-100"
                )}
                key={commit.sha}
                onClick={() => onCommitClick(commit.sha)}
                tabIndex={-1}
                type="button"
              >
                <Checkbox.Root
                  checked={selectedCommits.includes(commit.sha)}
                  onCheckedChange={() => onCommitClick(commit.sha)}
                />
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  {commit.type === "pr" && (
                    <GitPullRequestIcon className="size-4 text-success-500" />
                  )}
                  {commit.type === "commit" && (
                    <GitCommitVerticalIcon className="size-4 text-neutral-500" />
                  )}
                  <Text.Root
                    className="flex-1 truncate text-left"
                    weight="medium"
                  >
                    {commit.title}
                  </Text.Root>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Avatar.Root className="size-5 rounded-full">
                      <Avatar.Image src={commit.committer.avatarUrl} />
                      <Avatar.Fallback>
                        {commit.committer.login[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Text.Root weight="medium">
                      {commit.committer.login}
                    </Text.Root>
                  </div>
                  <Text.Root color="muted">·</Text.Root>
                  <Text.Root color="muted">
                    {format(commit.date, "MMM d")}
                  </Text.Root>
                </div>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

type ContentProps = {
  organizationId: string;
  selectedCommits: string[];
  onCommitClick: (sha: string) => void;
};

const Content: React.FC<ContentProps> = ({
  organizationId,
  selectedCommits,
  onCommitClick,
}) => {
  const commitsQuery = useInfiniteQuery({
    queryKey: ["github", organizationId],
    queryFn: async ({ pageParam, queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].integrations.github.$get({
        param: {
          organizationId: queryKey[1],
        },
        query: {
          cursor: pageParam,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return {
        data: json.data,
        meta: json.meta,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.cursor;
    },
  });

  console.log({ commitsQuery });

  const viewportRef = useRef<HTMLDivElement>(null);

  console.log({ viewportRef });

  return (
    <ScrollArea.Root className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Viewport className="h-128 w-full p-6" ref={viewportRef}>
        <Transition.Root>
          {match(commitsQuery)
            .with({ isPending: true }, () => (
              <Transition.Item key="skeleton">
                <div className="flex flex-col gap-2">
                  {new Array(25).fill(null).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
                    <ItemSkeleton key={index} />
                  ))}
                </div>
              </Transition.Item>
            ))
            .with({ isError: true }, ({ error }) => (
              <Transition.Item key="error">
                Error: {error.message}
              </Transition.Item>
            ))
            .with(
              {
                isSuccess: true,
                data: P.when((data) => data.pages.flat().length === 0),
              },
              () => (
                <Transition.Item key="empty">
                  "No commits found"
                </Transition.Item>
              )
            )
            .otherwise(({ data }) => (
              <List
                fetchNextPage={commitsQuery.fetchNextPage}
                hasNextPage={commitsQuery.hasNextPage}
                isFetchingNextPage={commitsQuery.isFetchingNextPage}
                onCommitClick={onCommitClick}
                pages={data.pages}
                selectedCommits={selectedCommits}
                viewportRef={viewportRef}
              />
            ))}
        </Transition.Root>
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
};

type StartWithGithubDialogProps = {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const StartWithGithubDialog: React.FC<StartWithGithubDialogProps> = ({
  organizationId,
  open,
  onOpenChange,
}) => {
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);

  const handleCommitClick = (sha: string) => {
    setSelectedCommits((prev) => {
      if (prev.includes(sha)) {
        return prev.filter((s) => s !== sha);
      }
      return [...prev, sha];
    });
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Content className="max-h-[calc(100vh-4rem)] gap-0 p-0">
        <Dialog.Header className="border-neutral-100 border-b p-6">
          <Dialog.Title>Create from GitHub</Dialog.Title>
          <Dialog.Description>
            Select commits or PRs to turn into a draft.
          </Dialog.Description>
        </Dialog.Header>
        <Content
          onCommitClick={handleCommitClick}
          organizationId={organizationId}
          selectedCommits={selectedCommits}
        />
        <Dialog.Footer className="border-neutral-100 border-t p-6">
          <Dialog.Cancel>Cancel</Dialog.Cancel>
          <Dialog.Action isDisabled={selectedCommits.length === 0}>
            Create from {selectedCommits.length} commit
            {selectedCommits.length === 1 ? "" : "s"}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
