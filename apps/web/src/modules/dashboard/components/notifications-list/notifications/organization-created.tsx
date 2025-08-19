import { Text } from "@mono/ui";
import { formatDistanceToNow } from "date-fns";
import { BuildingIcon } from "lucide-react";

interface OrganizationCreatedNotificationProps {
  organization: {
    id: string;
    name: string;
  };
  createdAt: string;
  isUnread: boolean;
}

export const OrganizationCreatedNotification: React.FC<
  OrganizationCreatedNotificationProps
> = ({ organization, createdAt, isUnread }) => {
  return (
    <div className="flex w-full gap-2 p-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent-50">
        <BuildingIcon className="size-4 text-accent-500" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-4 overflow-hidden">
          <Text.Root className="flex-1 truncate" color="muted">
            <Text.Root render={<span />} weight="medium">
              {organization.name}
            </Text.Root>{" "}
            has been successfully created.
          </Text.Root>
          {isUnread && <div className="size-2 rounded-full bg-accent-500" />}
        </div>
        <Text.Root color="muted" size="sm">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </Text.Root>
      </div>
    </div>
  );
};
