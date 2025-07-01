import * as Confirmer from "@components/feedback/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { useUnarchiveUpdateMutation } from "@modules/dashboard/hooks/useUnarchiveUpdateMutation";
import { DropdownMenu, IconButton } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import { ArchiveIcon } from "lucide-react";
import { EllipsisVerticalIcon } from "lucide-react";
import type React from "react";

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
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DropdownMenu.Item onClick={handleUnarchiveUpdate}>
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
