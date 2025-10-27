import { Transition } from "@components/transition";
import {
  Cancel01Icon,
  GitCommitIcon,
  GitPullRequestIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { api, SuccessResponse } from "@lib/api";
import { githubCommitsQuery } from "@lib/api/queries";
import { IconButton, ScrollArea, Text } from "@mono/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { AnimatePresence, motion } from "motion/react";
import { match, P } from "ts-pattern";
import { Item } from "./item";
import { List } from "./list";
import { getCommitId } from "./utils";

type Commit = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["repositories"][":repositoryId"]["commits"]["$get"]
  >
>[number];

type ContentProps = {
  organizationId: string;
  repositoryId?: string;
  selectedCommits: Commit[];
  onCommitClick: (commit: Commit) => void;
};

export const Content: React.FC<ContentProps> = ({
  organizationId,
  repositoryId,
  selectedCommits,
  onCommitClick,
}) => {
  const commitsQuery = useInfiniteQuery(
    githubCommitsQuery(organizationId, repositoryId)
  );

  return (
    <Transition.Root>
      {match(commitsQuery)
        .with({ isPending: true }, () => (
          <Transition.Item
            className="flex flex-1 overflow-hidden"
            key="skeleton"
          >
            <ScrollArea.Root className="flex flex-1 flex-col overflow-hidden">
              <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
              <ScrollArea.Viewport className="h-128 w-full p-6">
                <div className="flex flex-col gap-2">
                  {new Array(25).fill(null).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
                    <Item.Skeleton key={index} />
                  ))}
                </div>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </Transition.Item>
        ))
        .with({ isError: true }, ({ error }) => (
          <Transition.Item key="error">Error: {error.message}</Transition.Item>
        ))
        .with(
          {
            isSuccess: true,
            data: P.when((data) => data.pages.flat().length === 0),
          },
          () => (
            <Transition.Item key="empty">"No commits found"</Transition.Item>
          )
        )
        .otherwise(({ data }) => (
          <Transition.Item
            className="flex flex-1 flex-col overflow-hidden"
            key="list"
          >
            <AnimatePresence initial={false}>
              {selectedCommits.length > 0 && (
                <ScrollArea.Root>
                  <ScrollArea.Viewport
                    render={
                      <motion.div
                        animate={{ height: 59 }}
                        className="flex w-full overflow-hidden border-neutral-100 border-b bg-neutral-50"
                        exit={{ height: 0 }}
                        initial={{ height: 0 }}
                      />
                    }
                  >
                    <div className="flex w-full items-start gap-2 px-6 py-2">
                      <AnimatePresence>
                        {selectedCommits.map((commit) => (
                          <motion.div
                            animate={{ opacity: 1 }}
                            className="flex max-w-50 shrink-0 items-center gap-2 rounded-md border border-neutral-100 bg-white p-1 pl-2"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            key={getCommitId(commit)}
                            layout
                            transition={{ duration: 0.075 }}
                          >
                            {"prId" in commit && (
                              <HugeiconsIcon
                                className="size-4 shrink-0 text-neutral-500"
                                icon={GitPullRequestIcon}
                                strokeWidth={2}
                              />
                            )}
                            {"commitId" in commit && (
                              <HugeiconsIcon
                                className="size-4 shrink-0 text-neutral-500"
                                icon={GitCommitIcon}
                                strokeWidth={2}
                              />
                            )}
                            <Text.Root className="truncate" weight="medium">
                              {commit.title}
                            </Text.Root>
                            <IconButton.Root
                              className="shrink-0"
                              onClick={() => onCommitClick(commit)}
                              size="sm"
                              variant="tertiary"
                            >
                              <IconButton.Icon
                                render={
                                  <HugeiconsIcon
                                    icon={Cancel01Icon}
                                    strokeWidth={2}
                                  />
                                }
                              />
                            </IconButton.Root>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="horizontal" size="sm">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              )}
            </AnimatePresence>
            <List
              fetchNextPage={commitsQuery.fetchNextPage}
              hasNextPage={commitsQuery.hasNextPage}
              isFetchingNextPage={commitsQuery.isFetchingNextPage}
              onCommitClick={onCommitClick}
              pages={data.pages}
              selectedCommits={selectedCommits}
            />
          </Transition.Item>
        ))}
    </Transition.Root>
  );
};
