import { GroupBy } from "@components/group-by";
import * as UpdateEntry from "@components/update-entry";
import type { SuccessResponse, api } from "@lib/api";
import { useUpdateManager } from "@modules/dashboard/hooks/useUpdateManager";
import {
  Clickable,
  DropdownMenu,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
} from "@mono/ui";
import { Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import {
  ArchiveIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  ClockIcon,
} from "lucide-react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  MailIcon,
  MousePointer2,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

type Update = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$get"]
  >
>[number];

interface DraftUpdateProps extends Update {
  organizationSlug: string;
  organizationId: string;
}

const DraftUpdate: React.FC<DraftUpdateProps> = ({
  order,
  title,
  id,
  editors,
  tags,
  createdAt,
  updatedAt,
  organizationSlug,
  organizationId,
}) => {
  const { archiveUpdate } = useUpdateManager(id, organizationId);

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
        <UpdateEntry.Tags
          tags={tags.map(({ tag }) => tag.label)}
          className="flex-1"
        />
        <UpdateEntry.Meta>
          {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
          <UpdateEntry.Date date={updatedAt} label="Last edited on" />
          <UpdateEntry.Date date={createdAt} label="Created on" />
        </UpdateEntry.Meta>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton.Root size="sm" variant="tertiary" className="-my-2">
              <IconButton.Icon>
                <EllipsisVerticalIcon />
              </IconButton.Icon>
            </IconButton.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            side="bottom"
            align="end"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DropdownMenu.Item onClick={archiveUpdate}>
              <DropdownMenu.ItemIcon>
                <ArchiveIcon />
              </DropdownMenu.ItemIcon>
              Archive
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Link>
    </UpdateEntry.Root>
  );
};

const ScheduledUpdate: React.FC<Update> = ({ title, editors, order }) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags tags={["Feature", "Scheduled"]} className="flex-1" />
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        <UpdateEntry.Date
          date={new Date().toISOString()}
          label="Scheduled for"
        />
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

interface ArchivedUpdateProps extends Update {
  organizationSlug: string;
  organizationId: string;
}

const ArchivedUpdate: React.FC<ArchivedUpdateProps> = ({
  order,
  title,
  id,
  editors,
  tags,
  createdAt,
  updatedAt,
  organizationSlug,
  organizationId,
}) => {
  const { unarchiveUpdate } = useUpdateManager(id, organizationId);

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
        <UpdateEntry.Tags
          tags={tags.map(({ tag }) => tag.label)}
          className="flex-1"
        />
        <UpdateEntry.Meta>
          {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
          <UpdateEntry.Date date={updatedAt} label="Last edited on" />
          <UpdateEntry.Date date={createdAt} label="Created on" />
        </UpdateEntry.Meta>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton.Root size="sm" variant="tertiary" className="-my-2">
              <IconButton.Icon>
                <EllipsisVerticalIcon />
              </IconButton.Icon>
            </IconButton.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            side="bottom"
            align="end"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DropdownMenu.Item onClick={unarchiveUpdate}>
              <DropdownMenu.ItemIcon>
                <ArchiveIcon />
              </DropdownMenu.ItemIcon>
              Unarchive
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Link>
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
    archived: {
      icon: <ArchiveIcon className="size-4 text-neutral-500" />,
      label: "Archived",
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
  organizationId: string;
  organizationSlug: string;
  data: Update[];
}

export const UpdatesList: React.FC<UpdateListProps> & {
  Skeleton: React.FC;
} = ({ data, organizationSlug, organizationId }) => {
  const [archivedVisible, setArchivedVisible] = useState(false);
  const archivedPosts = useMemo(
    () => data.filter((post) => post.status === "archived"),
    [data],
  );

  return (
    <div className="flex flex-col divide-y divide-neutral-100">
      <GroupBy
        data={data}
        field="status"
        divider={(status) => <GroupDivider status={status} />}
        visible={(status) => {
          if (status === "archived") {
            return archivedVisible;
          }

          return true;
        }}
      >
        {(update) => {
          return (
            <div className="flex w-full" key={update.id}>
              {update.status === "draft" && (
                <DraftUpdate
                  {...update}
                  organizationSlug={organizationSlug}
                  organizationId={organizationId}
                />
              )}
              {update.status === "scheduled" && <ScheduledUpdate {...update} />}
              {update.status === "published" && <PublishedUpdate {...update} />}
              {update.status === "archived" && (
                <ArchivedUpdate
                  {...update}
                  organizationSlug={organizationSlug}
                  organizationId={organizationId}
                />
              )}
            </div>
          );
        }}
      </GroupBy>
      {archivedPosts.length > 0 && (
        <Clickable.Root
          variant="tertiary"
          className="flex items-center justify-center gap-2 rounded-none px-6 py-4"
          onClick={() => setArchivedVisible((prev) => !prev)}
        >
          {archivedVisible ? (
            <Text.Root size="sm" color="muted" className="text-center">
              Click here to hide archived updates
            </Text.Root>
          ) : (
            <Text.Root size="sm" color="muted" className="text-center">
              You have {archivedPosts.length} archived update
              {archivedPosts.length === 1 ? "" : "s"}. Click here to view them
            </Text.Root>
          )}
        </Clickable.Root>
      )}
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
