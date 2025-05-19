import { GroupBy } from "@components/group-by";
import * as UpdateEntry from "@components/update-entry";
import type { api } from "@lib/api";
import { IconButton, Skeleton, Text, Tooltip } from "@mono/ui";
import type { InferResponseType } from "hono/client";
import { CircleCheckIcon, CircleDashedIcon, ClockIcon } from "lucide-react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  MailIcon,
  MousePointer2,
} from "lucide-react";
import type React from "react";

// TODO: Move to utils/types
type SuccessResponse<
  T extends
    | { success: true; data: unknown }
    | { success: false; error: unknown },
> = T extends { success: true } ? T["data"] : never;

type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organization)[":organizationId"]["posts"]["$get"]
  >
>[number];

const DraftUpdate: React.FC<Update> = ({ title }) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={1} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags tags={["Feature", "Improvement"]} className="flex-1" />
      <UpdateEntry.Meta>
        <div className="flex gap-1">
          <img
            className="size-5 rounded-sm border-2 border-white bg-neutral-100"
            src="https://plus.unsplash.com/premium_photo-1747290111870-5842a4f652cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
            alt="asdf"
          />
          <Text.Root size="sm" weight="medium">
            Ilya Kulhavy
          </Text.Root>
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Text.Root
              size="sm"
              color="muted"
              className="decoration-dashed underline-offset-2 hover:underline"
            >
              5 minutes ago
            </Text.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Last edited on May 15, 8:30 AM</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Text.Root
              size="sm"
              color="muted"
              className="decoration-dashed underline-offset-2 hover:underline"
            >
              May 15
            </Text.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Created on May 15, 8:30 AM</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </UpdateEntry.Meta>
      <IconButton.Root size="sm" variant="tertiary" className="-my-2">
        <IconButton.Icon>
          <EllipsisVerticalIcon />
        </IconButton.Icon>
      </IconButton.Root>
    </UpdateEntry.Root>
  );
};

const ScheduledUpdate: React.FC<Update> = ({ title }) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={1} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags tags={["Feature", "Scheduled"]} className="flex-1" />
      <UpdateEntry.Meta>
        <div className="flex gap-1">
          <img
            className="size-5 rounded-sm border-2 border-white bg-neutral-100"
            src="https://plus.unsplash.com/premium_photo-1747290111870-5842a4f652cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
            alt="asdf"
          />
          <Text.Root size="sm" weight="medium">
            Ilya Kulhavy
          </Text.Root>
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Text.Root
              size="sm"
              color="muted"
              className="decoration-dashed underline-offset-2 hover:underline"
            >
              in 2 days
            </Text.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Scheduled for May 17, 8:30 AM</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </UpdateEntry.Meta>
      <IconButton.Root size="sm" variant="tertiary" className="-my-2">
        <IconButton.Icon>
          <EllipsisVerticalIcon />
        </IconButton.Icon>
      </IconButton.Root>
    </UpdateEntry.Root>
  );
};

const PublishedUpdate: React.FC<Update> = ({ title }) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={1} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags tags={["Feature", "Published"]} className="flex-1" />
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
        <div className="flex gap-1">
          <img
            className="size-5 rounded-sm border-2 border-white bg-neutral-100"
            src="https://plus.unsplash.com/premium_photo-1747290111870-5842a4f652cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
            alt="Sarah Chen"
          />
          <Text.Root size="sm" weight="medium">
            Sarah Chen
          </Text.Root>
        </div>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Text.Root
              size="sm"
              color="muted"
              className="decoration-dashed underline-offset-2 hover:underline"
            >
              May 15
            </Text.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Published on May 15, 9:45 AM</Tooltip.Title>
          </Tooltip.Content>
        </Tooltip.Root>
      </UpdateEntry.Meta>
      <IconButton.Root size="sm" variant="tertiary" className="-my-2">
        <IconButton.Icon>
          <EllipsisVerticalIcon />
        </IconButton.Icon>
      </IconButton.Root>
    </UpdateEntry.Root>
  );
};

const GroupDivider: React.FC<{ status: Update["status"] }> = ({ status }) => {
  const variants = {
    draft: {
      icon: <CircleDashedIcon className="size-4 text-neutral-500" />,
      label: "Drafts",
    },
    scheduled: {
      icon: <ClockIcon className="size-4 text-warning-500" />,
      label: "Scheduled",
    },
    published: {
      icon: <CircleCheckIcon className="size-4 text-success-500" />,
      label: "Published",
    },
  };

  const variant = variants[status];

  if (!variant) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-6">
      {variant.icon}
      <Text.Root size="sm" weight="medium">
        {variant.label}
      </Text.Root>
    </div>
  );
};

interface UpdateListProps {
  data: Update[];
}

export const UpdatesList: React.FC<UpdateListProps> & {
  Skeleton: React.FC;
} = ({ data }) => {
  return (
    <div className="flex flex-col divide-y divide-neutral-100">
      <GroupBy
        data={data}
        field="status"
        divider={(status) => <GroupDivider status={status} />}
      >
        {(update) => (
          <div className="flex w-full" key={update.id}>
            {update.status === "draft" && <DraftUpdate {...update} />}
            {update.status === "scheduled" && <ScheduledUpdate {...update} />}
            {update.status === "published" && <PublishedUpdate {...update} />}
          </div>
        )}
      </GroupBy>
    </div>
  );
};

UpdatesList.Skeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-neutral-100">
      <div className="flex items-center gap-2 p-6">
        <Skeleton.Root className="h-4 w-4 rounded-full" />
        <Skeleton.Root className="my-0.5 h-4 w-20 rounded-xs" />
      </div>
      {new Array(10).fill(null).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
        <div className="flex gap-6 px-6 py-4" key={index}>
          <div className="flex gap-2">
            <Skeleton.Root className="h-5 w-8 rounded-xs" />
            <Skeleton.Root
              className="h-5 rounded-xs"
              style={{ width: Math.random() * 200 + 100 }}
            />
          </div>
          <div className="flex flex-1 gap-2">
            <Skeleton.Root className="h-5 w-10 rounded-xs" />
            <Skeleton.Root className="h-5 w-12 rounded-xs" />
          </div>
          <div className="flex gap-2">
            <Skeleton.Root className="h-5 w-34 rounded-xs" />
            <Text.Root size="sm" className="text-neutral-100">
              ·
            </Text.Root>
            <Skeleton.Root className="h-5 w-22 rounded-xs" />
            <Text.Root size="sm" className="text-neutral-100">
              ·
            </Text.Root>
            <Skeleton.Root className="h-5 w-11 rounded-xs" />
          </div>
          <Skeleton.Root className="mx-2 h-5 w-5 rounded-xs" />
        </div>
      ))}
    </div>
  );
};
