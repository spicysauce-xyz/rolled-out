import { SchedulePostDialog } from "@modules/dashboard/components/schedule-post-dialog";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { DropdownMenu, IconButton } from "@mono/ui";
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
            <DropdownMenu.Item>
              <DropdownMenu.ItemIcon render={<SendIcon />} />
              Publish now
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={schedulePostDialog.open}>
              <DropdownMenu.ItemIcon render={<TimerResetIcon />} />
              Reschedule
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <DropdownMenu.ItemIcon render={<TimerOffIcon />} />
              Cancel scheduling
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
      <SchedulePostDialog
        defaultValue={scheduledAt}
        isOpen={schedulePostDialog.isOpen}
        onOpenChange={schedulePostDialog.setOpen}
        organizationId={organizationId}
        postId={id}
      />
    </>
  );
};
