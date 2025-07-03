import { DropdownMenu, IconButton } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { BellIcon, BellRingIcon } from "lucide-react";

export const NotificationsList = () => {
  const hasUnreadNotifications = false;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton.Root
          className={cn(
            "shrink-0",
            !hasUnreadNotifications && "hover:bg-neutral-100"
          )}
          color={hasUnreadNotifications ? "accent" : "neutral"}
          size="sm"
          variant="tertiary"
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
      <DropdownMenu.Content align="end" side="right">
        <DropdownMenu.Item>
          <span>Notifications</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
