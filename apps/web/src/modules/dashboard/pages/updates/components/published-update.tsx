import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { IconButton, Text, Tooltip } from "@mono/ui";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  MailIcon,
  MousePointer2,
} from "lucide-react";
import type React from "react";

interface PublishedUpdateProps {
  order: number;
  title: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
  tags: Array<{ tag: { label: string } }>;
  publishedAt: string | null;
}

export const PublishedUpdate: React.FC<PublishedUpdateProps> = ({
  order,
  title,
  tags,
  editors,
  publishedAt,
}) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags
        tags={tags.map(({ tag }) => tag.label)}
        className="flex-1"
      />
      <UpdateEntry.Meta>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="group flex items-center gap-1">
              <EyeIcon className="size-4 text-neutral-500" />
              <Text.Root
                className="decoration-dashed underline-offset-2 group-hover:underline"
                size="sm"
                weight="medium"
                color="muted"
              >
                2,847
              </Text.Root>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Views</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="group flex items-center gap-1">
              <MailIcon className="size-4 text-neutral-500" />
              <Text.Root
                className="decoration-dashed underline-offset-2 group-hover:underline"
                size="sm"
                weight="medium"
                color="muted"
              >
                1,293
              </Text.Root>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Emails</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="group flex items-center gap-1">
              <MousePointer2 className="size-4 text-neutral-500" />
              <Text.Root
                className="decoration-dashed underline-offset-2 group-hover:underline"
                size="sm"
                weight="medium"
                color="muted"
              >
                4.8%
              </Text.Root>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Clickthrough rate</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </UpdateEntry.Meta>
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        {publishedAt && (
          <UpdateEntry.Date date={publishedAt} label="Published on" />
        )}
      </UpdateEntry.Meta>
      <IconButton.Root size="sm" variant="tertiary" className="-my-2">
        <IconButton.Icon>
          <EllipsisVerticalIcon />
        </IconButton.Icon>
      </IconButton.Root>
    </UpdateEntry.Root>
  );
};
