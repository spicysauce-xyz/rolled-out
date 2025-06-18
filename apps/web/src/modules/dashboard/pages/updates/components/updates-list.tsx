import { GroupBy } from "@components/group-by";
import * as UpdateEntry from "@components/update-entry";
import type { SuccessResponse, api } from "@lib/api";
import { Avatar, IconButton, Skeleton, Text, Tooltip } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { InferResponseType } from "hono/client";
import { CircleCheckIcon, CircleDashedIcon, ClockIcon } from "lucide-react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  MailIcon,
  MousePointer2,
} from "lucide-react";
import type React from "react";

type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$get"]
  >
>[number];

interface DraftUpdateProps extends Update {
  organizationSlug: string;
}

const DraftUpdate: React.FC<DraftUpdateProps> = ({
  order,
  title,
  id,
  editors: _editors,
  createdAt,
  updatedAt,
  organizationSlug,
}) => {
  const creator = _editors[0];
  const editors = _editors.slice(1);

  return (
    <UpdateEntry.Root asChild>
      <Link
        to="/$organizationSlug/editor/$id"
        params={{ organizationSlug, id }}
      >
        <UpdateEntry.Group>
          <UpdateEntry.Number number={order} />
          <UpdateEntry.Title title={title} />
        </UpdateEntry.Group>
        <UpdateEntry.Tags tags={["Fixes", "Mobile"]} className="flex-1" />
        <UpdateEntry.Meta>
          <Tooltip.Root>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <Avatar.Root className="size-5 rounded-sm">
                  <Avatar.Image src={creator?.image || ""} />
                  <Avatar.Fallback>{creator?.name?.charAt(0)}</Avatar.Fallback>
                </Avatar.Root>
                <Text.Root size="sm" weight="medium">
                  {creator?.name ?? "Unknown"}
                </Text.Root>
              </div>
              <Tooltip.Trigger asChild>
                {editors.length > 0 && (
                  <Text.Root
                    size="sm"
                    color="muted"
                    className="decoration-dashed underline-offset-2 hover:underline"
                  >
                    {" "}
                    and {editors.length} other{editors.length !== 1 ? "s" : ""}
                  </Text.Root>
                )}
              </Tooltip.Trigger>
            </div>
            <Tooltip.Content>
              <Tooltip.Title>
                {editors.map((editor) => editor.name).join(", ")}
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Text.Root
                size="sm"
                color="muted"
                className="decoration-dashed underline-offset-2 hover:underline"
              >
                {format(updatedAt, "MMM d")}
              </Text.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>
                Last edited on {format(updatedAt, "MMM d, h:mm a")}
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Text.Root
                size="sm"
                color="muted"
                className="decoration-dashed underline-offset-2 hover:underline"
              >
                {format(createdAt, "MMM d")}
              </Text.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>
                Created on {format(createdAt, "MMM d, h:mm a")}
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
        </UpdateEntry.Meta>
        <IconButton.Root size="sm" variant="tertiary" className="-my-2">
          <IconButton.Icon>
            <EllipsisVerticalIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </Link>
    </UpdateEntry.Root>
  );
};

const ScheduledUpdate: React.FC<Update> = ({ title, createdBy, order }) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags tags={["Feature", "Scheduled"]} className="flex-1" />
      <UpdateEntry.Meta>
        <div className="flex gap-1">
          <Avatar.Root className="size-5 rounded-sm">
            <Avatar.Image src={createdBy?.image || ""} />
            <Avatar.Fallback>{createdBy?.name?.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>
          <Text.Root size="sm" weight="medium">
            {createdBy?.name ?? "Unknown"}
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

const PublishedUpdate: React.FC<Update> = ({
  order,
  title,
  createdBy,
  publishedAt,
}) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
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
          <Avatar.Root className="size-5 rounded-sm">
            <Avatar.Image src={createdBy?.image || ""} />
            <Avatar.Fallback>{createdBy?.name?.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>
          <Text.Root size="sm" weight="medium">
            {createdBy?.name ?? "Unknown"}
          </Text.Root>
        </div>
        {publishedAt && (
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Text.Root
                size="sm"
                color="muted"
                className="decoration-dashed underline-offset-2 hover:underline"
              >
                {format(publishedAt, "MMM d")}
              </Text.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>
                Published on {format(publishedAt, "MMM d, h:mm a")}
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
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
  organizationSlug: string;
  data: Update[];
}

export const UpdatesList: React.FC<UpdateListProps> & {
  Skeleton: React.FC;
} = ({ data, organizationSlug }) => {
  return (
    <div className="flex flex-col divide-y divide-neutral-100">
      <GroupBy
        data={data}
        field="status"
        divider={(status) => <GroupDivider status={status} />}
      >
        {(update) => {
          return (
            <div className="flex w-full" key={update.id}>
              {update.status === "draft" && (
                <DraftUpdate {...update} organizationSlug={organizationSlug} />
              )}
              {update.status === "scheduled" && <ScheduledUpdate {...update} />}
              {update.status === "published" && <PublishedUpdate {...update} />}
            </div>
          );
        }}
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
