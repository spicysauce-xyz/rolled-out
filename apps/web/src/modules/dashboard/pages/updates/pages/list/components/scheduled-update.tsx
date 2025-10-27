import { Confirmer } from "@components/confirmer";
import {
  Calendar01Icon,
  CalendarRemove02Icon,
  Copy01Icon,
  Delete02Icon,
  MoreVerticalCircle01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SchedulePostDialog } from "@modules/dashboard/components/schedule-post-dialog";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useDeleteUpdateMutation } from "@modules/dashboard/hooks/use-delete-update-mutation";
import { useDuplicatePostMutation } from "@modules/dashboard/hooks/use-duplicate-update-mutation";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { useUnschedulePostMutation } from "@modules/dashboard/hooks/use-unschedule-update-mutation";
import { DropdownMenu, IconButton, Toaster } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import type React from "react";

interface ScheduledUpdateProps {
  order: number;
  title: string;
  editors: Array<{
    role: "creator" | "editor";
    createdAt: string;
    updatedAt: string;
    member: { user: { id: string; name: string; image: string | null } };
  }>;
  organizationSlug: string;
  id: string;
  scheduledAt: string | null;
  organizationId: string;
}
export const ScheduledUpdate: React.FC<ScheduledUpdateProps> = ({
  title,
  editors,
  order,
  scheduledAt,
  organizationId,
  id,
}) => {
  const schedulePostDialog = useDisclosure();

  const { mutateAsync: unschedulePost } = useUnschedulePostMutation();

  const handleUnschedulePost = () => {
    Confirmer.confirm({
      title: "Remove schedule",
      description:
        "Are you sure you want to unschedule this update? You can always set a new time later.",
      action: {
        label: "Yes, unschedule",
        color: "danger",
        icon: CalendarRemove02Icon,
        run: () =>
          unschedulePost(
            { organizationId, id },
            {
              onSuccess() {
                Toaster.success("Schedule removed", {
                  description: "This update is no longer scheduled.",
                });
              },
              onError() {
                Toaster.error("Couldn't remove schedule", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

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
        label: "Yes, delete",
        icon: Delete02Icon,
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
      <UpdateEntry.Root>
        <UpdateEntry.Group>
          <UpdateEntry.Number number={order} />
          <UpdateEntry.Title title={title} />
        </UpdateEntry.Group>
        <div className="flex-1" />
        <UpdateEntry.Meta>
          {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
          {scheduledAt && (
            <UpdateEntry.Date date={scheduledAt} label="Scheduled for" />
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
            <DropdownMenu.Item onClick={handlePublishPost}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Sent02Icon} strokeWidth={2} />}
              />
              Publish now
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={schedulePostDialog.open}>
              <DropdownMenu.ItemIcon
                render={<HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />}
              />
              Reschedule
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleUnschedulePost}>
              <DropdownMenu.ItemIcon
                render={
                  <HugeiconsIcon icon={CalendarRemove02Icon} strokeWidth={2} />
                }
              />
              Cancel scheduling
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
        defaultValue={scheduledAt}
        isOpen={schedulePostDialog.isOpen}
        mode="update"
        onOpenChange={schedulePostDialog.setOpen}
        organizationId={organizationId}
        postId={id}
      />
    </>
  );
};
