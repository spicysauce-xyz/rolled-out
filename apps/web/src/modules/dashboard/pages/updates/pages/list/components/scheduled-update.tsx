import { Confirmer } from "@components/confirmer";
import { SchedulePostDialog } from "@modules/dashboard/components/schedule-post-dialog";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useDeleteUpdateMutation } from "@modules/dashboard/hooks/use-delete-update-mutation";
import { useDuplicatePostMutation } from "@modules/dashboard/hooks/use-duplicate-update-mutation";
import { usePublishUpdateMutation } from "@modules/dashboard/hooks/use-publish-update-mutation";
import { useUnschedulePostMutation } from "@modules/dashboard/hooks/use-unschedule-update-mutation";
import { DropdownMenu, IconButton, Toaster } from "@mono/ui";
import { useDisclosure } from "@mono/ui/hooks";
import {
  CopyIcon,
  EllipsisVerticalIcon,
  SendIcon,
  TimerOffIcon,
  TimerResetIcon,
  Trash2Icon,
} from "lucide-react";
import type React from "react";

interface ScheduledUpdateProps {
  order: number;
  title: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
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
        icon: TimerOffIcon,
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
        icon: SendIcon,
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
            <DropdownMenu.Item onClick={handlePublishPost}>
              <DropdownMenu.ItemIcon render={<SendIcon />} />
              Publish now
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={schedulePostDialog.open}>
              <DropdownMenu.ItemIcon render={<TimerResetIcon />} />
              Reschedule
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleUnschedulePost}>
              <DropdownMenu.ItemIcon render={<TimerOffIcon />} />
              Cancel scheduling
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
