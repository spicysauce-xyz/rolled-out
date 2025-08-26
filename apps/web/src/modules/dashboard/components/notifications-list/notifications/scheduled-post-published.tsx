import { Text } from "@mono/ui";
import { formatDistanceToNow } from "date-fns";
import { SendIcon } from "lucide-react";

interface ScheduledPostPublishedNotificationProps {
  post: {
    id: string;
    title: string;
  } | null;
  createdAt: string;
  isUnread: boolean;
}

export const ScheduledPostPublishedNotification: React.FC<
  ScheduledPostPublishedNotificationProps
> = ({ post, createdAt, isUnread }) => {
  if (!post) {
    return null;
  }

  return (
    <div className="flex w-full gap-2 p-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-success-50">
        <SendIcon className="size-4 text-success-500" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-4 overflow-hidden">
          <Text.Root className="flex-1 truncate" color="muted">
            <Text.Root render={<span />} weight="medium">
              {post.title}
            </Text.Root>{" "}
            has been successfully published.
          </Text.Root>
          {isUnread && <div className="size-2 rounded-full bg-accent-500" />}
        </div>
        <Text.Root color="muted" size="sm">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </Text.Root>
      </div>
    </div>
  );
};
