import { Confirmer } from "@components/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { DropdownMenu, IconButton } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  CalendarIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  PencilLineIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import type React from "react";

interface DraftUpdateProps {
  order: number;
  title: string;
  id: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
  createdAt: string;
  updatedAt: string;
  organizationSlug: string;
  organizationId: string;
}

export const DraftUpdate: React.FC<DraftUpdateProps> = ({
  order,
  title,
  id,
  editors,
  createdAt,
  updatedAt,
  organizationSlug,
  organizationId,
}) => {
  const { mutate: publishPost, isPending: isPublishing } =
    usePublishUpdateMutation();

  const handlePublishPost = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Publish update",
      description:
        "Are you sure you want to publish this update? The update will be published immediately and will be visible to all users. You can unpublish it later if needed.",
      action: {
        label: "Publish",
      },
    });

    if (confirmed) {
      publishPost({ organizationId, id });
    }
  };

  return (
    <UpdateEntry.Root
      render={
        <Link
          params={{ organizationSlug, id }}
          to="/$organizationSlug/updates/$id"
        />
      }
    >
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <div className="flex-1" />
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        <UpdateEntry.Date date={updatedAt} label="Last edited on" />
        <UpdateEntry.Date date={createdAt} label="Created on" />
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
              isLoading={isPublishing}
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
          <DropdownMenu.Item
            render={
              <Link
                params={{ organizationSlug, id }}
                to="/$organizationSlug/updates/$id"
              />
            }
          >
            <DropdownMenu.ItemIcon render={<PencilLineIcon />} />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon render={<CalendarIcon />} />
            Schedule
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={handlePublishPost}>
            <DropdownMenu.ItemIcon render={<SendIcon />} />
            Publish now
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
