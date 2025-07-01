import * as Confirmer from "@components/feedback/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";

import { useArchiveUpdateMutation } from "@modules/dashboard/hooks/useArchiveUpdateMutation";
import { DropdownMenu, IconButton } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import { ArchiveIcon } from "lucide-react";
import { EllipsisVerticalIcon } from "lucide-react";
import type React from "react";

interface DraftUpdateProps {
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

export const DraftUpdate: React.FC<DraftUpdateProps> = ({
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
  const archiveUpdateMutation = useArchiveUpdateMutation();

  const handleArchiveUpdate = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Archive Update",
      description:
        "Are you sure you want to archive this update? This update will be moved to the archived section.",
      action: {
        label: "Archive",
        icon: ArchiveIcon,
      },
    });

    if (!confirmed) {
      return;
    }

    await archiveUpdateMutation.mutateAsync({
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
            <DropdownMenu.Item onClick={handleArchiveUpdate}>
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
