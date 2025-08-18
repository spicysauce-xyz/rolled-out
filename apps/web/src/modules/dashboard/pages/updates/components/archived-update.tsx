import { Confirmer } from "@components/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useUnarchiveUpdateMutation } from "@modules/dashboard/hooks/use-unarchive-update-mutation";
import { DropdownMenu, IconButton, Text } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import { ArchiveIcon, EllipsisVerticalIcon } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

interface ArchivedUpdateProps {
  order: number;
  title: string;
  id: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
  tags: Array<{ tag: { label: string } }>;
  createdAt: string;
  updatedAt: string;
  organizationSlug: string;
  organizationId: string;
}

export const ArchivedUpdate: React.FC<ArchivedUpdateProps> = ({
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
  const unarchiveUpdateMutation = useUnarchiveUpdateMutation();

  const handleUnarchiveUpdate = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Unarchive Update",
      description:
        "Are you sure you want to unarchive this update? This update will be moved back to the drafts section.",
      action: {
        label: "Unarchive",
        icon: ArchiveIcon,
      },
    });

    if (!confirmed) {
      return;
    }

    await unarchiveUpdateMutation.mutateAsync({
      organizationId,
      id,
    });
  };

  return (
    <UpdateEntry.Root>
      <Link
        params={{ organizationSlug, id }}
        to="/$organizationSlug/editor/$id"
      >
        <UpdateEntry.Group>
          <UpdateEntry.Number number={order} />
          <UpdateEntry.Title title={title} />
        </UpdateEntry.Group>
        <UpdateEntry.Tags
          className="flex-1"
          tags={tags.map(({ tag }) => tag.label)}
        />
        <UpdateEntry.Meta>
          {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
          <UpdateEntry.Date date={updatedAt} label="Last edited on" />
          <UpdateEntry.Date date={createdAt} label="Created on" />
        </UpdateEntry.Meta>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
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
            <DropdownMenu.Item onClick={handleUnarchiveUpdate}>
              <DropdownMenu.ItemIcon render={<ArchiveIcon />} />
              Unarchive
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Link>
    </UpdateEntry.Root>
  );
};

interface ArchivedUpdatesButtonProps {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}

export const ArchivedUpdatesButton: React.FC<ArchivedUpdatesButtonProps> = ({
  count,
  isOpen,
  onClick,
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 rounded-none px-6 py-4"
      onClick={onClick}
      type="button"
    >
      {isOpen ? (
        <Text.Root className="text-center" color="muted">
          Click here to hide archived updates
        </Text.Root>
      ) : (
        <Text.Root className="text-center" color="muted">
          You have {count} archived update{count === 1 ? "" : "s"}. Click here
          to view them
        </Text.Root>
      )}
    </button>
  );
};

export const useArchivedUpdates = (data: { status: string }[]) => {
  const [archivedVisible, setArchivedVisible] = useState(false);

  const count = useMemo(() => {
    return data.filter((post) => post.status === "archived").length;
  }, [data]);

  const allPostsAreArchived = data.length > 0 && data.length === count;

  return {
    count,
    isOpen: allPostsAreArchived || archivedVisible,
    toggle: () => setArchivedVisible((v) => !v),
    buttonVisible: count > 0 && !allPostsAreArchived,
  };
};
