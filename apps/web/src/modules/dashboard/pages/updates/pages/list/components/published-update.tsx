import { Confirmer } from "@components/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useDeleteUpdateMutation } from "@modules/dashboard/hooks/use-delete-update-mutation";
import { useDuplicatePostMutation } from "@modules/dashboard/hooks/use-duplicate-update-mutation";
import { useUnpublishPostMutation } from "@modules/dashboard/hooks/use-unpublish-update-mutation";
import { DropdownMenu, IconButton, Toaster } from "@mono/ui";
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
  const { mutateAsync: unpublishPost } = useUnpublishPostMutation();

  const handleUnpublishPost = () => {
    Confirmer.confirm({
      title: "Unpublish update",
      description:
        "Are you sure you want to unpublish this update? It’ll be hidden from everyone and moved to Drafts. You can publish it again anytime.",
      action: {
        label: "Yes, unpublish",
        icon: BanIcon,
        color: "danger",
        run: () =>
          unpublishPost(
            { organizationId, id },
            {
              onSuccess() {
                Toaster.success("Update unpublished", {
                  description: "The update is now in Drafts.",
                });
              },
              onError() {
                Toaster.error("Couldn't unpublish update", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const { mutateAsync: deletePost } = useDeleteUpdateMutation();

  const handleDeletePost = () => {
    Confirmer.confirm({
      title: "Delete update",
      description:
        "Are you sure you want to delete this update? This can’t be undone.",
      action: {
        label: "Yes, delete",
        icon: Trash2Icon,
        color: "danger",
        run: () =>
          deletePost(
            { organizationId, id },
            {
              onSuccess() {
                Toaster.success("Update deleted", {
                  description: "The update has been removed.",
                });
              },
              onError() {
                Toaster.error("Couldn't delete update", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const { mutateAsync: duplicatePost } = useDuplicatePostMutation();

  const handleDuplicatePost = () => {
    Confirmer.confirm({
      title: "Duplicate update",
      description: "Are you sure you want to duplicate this update?",
      action: {
        label: "Yes, duplicate",
        icon: CopyIcon,
        run: () =>
          duplicatePost(
            { organizationId, id },
            {
              onSuccess() {
                Toaster.success("Update duplicated", {
                  description: "A copy of this update has been created.",
                });
              },
              onError() {
                Toaster.error("Couldn't duplicate update", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
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
          render={<IconButton.Root className="-my-2" variant="tertiary" />}
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
          <DropdownMenu.Item onClick={handleDuplicatePost}>
            <DropdownMenu.ItemIcon render={<CopyIcon />} />
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={handleDeletePost}>
            <DropdownMenu.ItemIcon render={<Trash2Icon />} />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </UpdateEntry.Root>
  );
};
