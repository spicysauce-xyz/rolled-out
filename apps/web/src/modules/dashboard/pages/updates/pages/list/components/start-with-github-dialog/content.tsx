import { Transition } from "@components/transition";
import { githubCommitsQuery } from "@lib/api/queries";
import { ScrollArea } from "@mono/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { match, P } from "ts-pattern";
import { Item } from "./item";
import { List } from "./list";

type ContentProps = {
  organizationId: string;
  repositoryId?: string;
  selectedCommits: string[];
  onCommitClick: (sha: string) => void;
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
          <Transition.Item className="flex flex-1 overflow-hidden" key="list">
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
