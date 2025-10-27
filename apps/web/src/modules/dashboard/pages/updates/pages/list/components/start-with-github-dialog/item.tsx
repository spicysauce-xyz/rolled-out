import { GitCommitIcon, GitPullRequestIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { api, SuccessResponse } from "@lib/api";
import { Avatar, Checkbox, Skeleton, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { format } from "date-fns";
import type { InferResponseType } from "hono";

type Commit = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["repositories"][":repositoryId"]["commits"]["$get"]
  >
>[number];

type ItemProps = {
  commit: Commit;
  isSelected: boolean;
  onClick: (commit: Commit) => void;
};

export const Item: React.FC<ItemProps> & { Skeleton: React.FC } = ({
  commit,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-4 rounded-md border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50",
        isSelected && "bg-neutral-100 hover:bg-neutral-100"
      )}
      onClick={() => onClick(commit)}
      tabIndex={-1}
      type="button"
    >
      <Checkbox.Root
        checked={isSelected}
        onCheckedChange={() => onClick(commit)}
      />
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        {"prId" in commit && (
          <HugeiconsIcon
            className="size-4 text-neutral-500"
            icon={GitPullRequestIcon}
            strokeWidth={2}
          />
        )}
        {"commitId" in commit && (
          <HugeiconsIcon
            className="size-4 text-neutral-500"
            icon={GitCommitIcon}
            strokeWidth={2}
          />
        )}
        <Text.Root className="flex-1 truncate text-left" weight="medium">
          {commit.title}
        </Text.Root>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Avatar.Root className="size-5 rounded-full">
            <Avatar.Image src={commit.committer.avatarUrl} />
            <Avatar.Fallback>{commit.committer.login[0]}</Avatar.Fallback>
          </Avatar.Root>
          <Text.Root weight="medium">{commit.committer.login}</Text.Root>
        </div>
        <Text.Root color="muted">·</Text.Root>
        <Text.Root color="muted">{format(commit.date, "MMM d")}</Text.Root>
      </div>
    </button>
  );
};

Item.Skeleton = () => {
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
