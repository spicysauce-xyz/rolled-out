import { Confirmer } from "@components/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useUnpublishPostMutation } from "@modules/dashboard/hooks/use-unpublish-update-mutation";
import { DropdownMenu, IconButton } from "@mono/ui";
import {
  BanIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import type React from "react";

interface PublishedUpdateProps {
  order: number;
  title: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
  publishedAt: string | null;
  organizationSlug: string;
  organizationId: string;
  id: string;
}

export const PublishedUpdate: React.FC<PublishedUpdateProps> = ({
  order,
  title,
  editors,
  publishedAt,
  organizationId,
  id,
}) => {
  const { mutate: unpublishPost, isPending: isUnpublishing } =
    useUnpublishPostMutation();

  const handleUnpublishPost = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Unpublish update",
      description:
        "Are you sure you want to unpublish this update? The update will be hidden from all users. You can publish it again later if needed.",
      action: {
        label: "Unpublish",
      },
    });

    if (confirmed) {
      unpublishPost({ organizationId, id });
    }
  };

  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <div className="flex-1" />
      {/* <UpdateEntry.Meta>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="group flex items-center gap-1">
              <EyeIcon className="size-4 text-neutral-500" />
              <Text.Root
                className="decoration-dashed underline-offset-2 group-hover:underline"
                color="muted"
                size="sm"
                weight="medium"
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
                color="muted"
                size="sm"
                weight="medium"
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
                color="muted"
                size="sm"
                weight="medium"
              >
                4.8%
              </Text.Root>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Clickthrough rate</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </UpdateEntry.Meta> */}
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        {publishedAt && (
          <UpdateEntry.Date date={publishedAt} label="Published on" />
        )}
      </UpdateEntry.Meta>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          render={
            <IconButton.Root
              className="-my-2"
              isLoading={isUnpublishing}
              variant="tertiary"
            />
          }
        >
          <IconButton.Icon>
            <EllipsisVerticalIcon />
          </IconButton.Icon>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          side="bottom"
        >
          <DropdownMenu.Item onClick={handleUnpublishPost}>
            <DropdownMenu.ItemIcon render={<BanIcon />} />
            Unpublish
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon render={<CopyIcon />} />
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon render={<Trash2Icon />} />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </UpdateEntry.Root>
  );
};
