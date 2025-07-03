import { UpdateEntry } from "@modules/dashboard/components/update-list";
import { IconButton } from "@mono/ui";
import { EllipsisVerticalIcon } from "lucide-react";
import type React from "react";

interface ScheduledUpdateProps {
  order: number;
  title: string;
  editors: Array<{ user: { id: string; name: string; image: string | null } }>;
}
export const ScheduledUpdate: React.FC<ScheduledUpdateProps> = ({
  title,
  editors,
  order,
}) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags className="flex-1" tags={["Feature", "Scheduled"]} />
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        <UpdateEntry.Date
          date={new Date().toISOString()}
          label="Scheduled for"
        />
      </UpdateEntry.Meta>
      <IconButton.Root className="-my-2" size="sm" variant="tertiary">
        <IconButton.Icon>
          <EllipsisVerticalIcon />
        </IconButton.Icon>
      </IconButton.Root>
    </UpdateEntry.Root>
  );
};
