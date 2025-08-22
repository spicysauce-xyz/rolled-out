import { Confirmer } from "@components/confirmer";
import { UpdateEntry } from "@modules/dashboard/components/update-list";

import { useArchiveUpdateMutation } from "@modules/dashboard/hooks/use-archive-update-mutation";
import { DropdownMenu, IconButton } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import { ArchiveIcon, EllipsisVerticalIcon } from "lucide-react";
import type React from "react";

interface DraftUpdateProps {
  order: number;
  title: string;
  id: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
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
          <DropdownMenu.Item onClick={handleArchiveUpdate}>
            <DropdownMenu.ItemIcon render={<ArchiveIcon />} />
            Archive
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </UpdateEntry.Root>
  );
};
