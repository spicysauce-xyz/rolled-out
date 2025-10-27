import { Confirmer } from "@components/confirmer";
import {
  Calendar01Icon,
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreVerticalCircle01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SchedulePostDialog } from "@modules/dashboard/components/schedule-post-dialog";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useDeleteUpdateMutation } from "@modules/dashboard/hooks/use-delete-update-mutation";
import { useDuplicatePostMutation } from "@modules/dashboard/hooks/use-duplicate-update-mutation";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { DropdownMenu, IconButton, Toaster } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import { Link } from "@tanstack/react-router";
import type React from "react";

interface DraftUpdateProps {
  order: number;
  title: string;
  id: string;
  editors: Array<{
    role: "creator" | "editor";
    createdAt: string;
    updatedAt: string;
    member: { user: { id: string; name: string; image: string | null } };
  }>;
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
  const schedulePostDialog = useDisclosure();

  const { mutateAsync: publishPost } = usePublishUpdateMutation();

  const handlePublishPost = () => {
    Confirmer.confirm({
      title: "Publish update",
      description:
        "Are you sure you want to publish this update? It’ll go live right away and be visible to everyone. You can unpublish it later if needed.",
      action: {
        label: "Yes, publish",
        color: "success",
        icon: Sent02Icon,
        run: () =>
          publishPost(
            { organizationId, id },
            {
              onSuccess() {
                Toaster.success("Update published", {
                  description: "Your update is now live.",
                });
              },
              onError() {
                Toaster.error("Couldn't publish update", {
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
        icon: Delete02Icon,
        label: "Yes, delete",
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
        icon: Copy01Icon,
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
    <>
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
            render={<IconButton.Root className="-my-2" variant="tertiary" />}
          >
            <IconButton.Icon>
              <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} />
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
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />}
              />
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={schedulePostDialog.open}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />}
              />
              Schedule
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handlePublishPost}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Sent02Icon} strokeWidth={2} />}
              />
              Publish
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={handleDuplicatePost}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />}
              />
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleDeletePost}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />}
              />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </UpdateEntry.Root>
      <SchedulePostDialog
        isOpen={schedulePostDialog.isOpen}
        onOpenChange={schedulePostDialog.setOpen}
        organizationId={organizationId}
        postId={id}
      />
    </>
  );
};
