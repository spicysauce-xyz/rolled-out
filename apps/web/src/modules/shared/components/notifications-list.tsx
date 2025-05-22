import { DropdownMenu, IconButton } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { BellIcon, BellRingIcon } from "lucide-react";

export const NotificationsList = () => {
  const hasUnreadNotifications = false;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton.Root
          variant="tertiary"
          color={hasUnreadNotifications ? "accent" : "neutral"}
          className={cn(
            "shrink-0",
            !hasUnreadNotifications && "hover:bg-neutral-100",
          )}
          size="sm"
        >
          <IconButton.Icon>
            {hasUnreadNotifications ? (
              <BellRingIcon className="animate-shake text-accent-500" />
            ) : (
              <BellIcon />
            )}
          </IconButton.Icon>
        </IconButton.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="end">
        <DropdownMenu.Item>
          <span>Notifications</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
