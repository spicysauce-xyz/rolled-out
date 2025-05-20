import { useLogout } from "@modules/auth/hooks/useLogout";
import { useSession } from "@modules/auth/hooks/useSession";
import { Avatar, Clickable, DropdownMenu, Text } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";

interface UserMenuProps {
  organizationSlug: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ organizationSlug }) => {
  const logout = useLogout();
  const { data: sessionData } = useSession();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Clickable.Root
          className="flex h-9 w-full items-center px-2 hover:bg-neutral-100"
          variant="tertiary"
        >
          <div className="flex items-center gap-2">
            <User2Icon className="size-4 stroke-neutral-900" />
            <Text.Root weight="medium" size="sm">
              {sessionData?.data?.user?.name || ""}
            </Text.Root>
          </div>
          <Clickable.Icon className="ml-auto">
            <EllipsisVerticalIcon />
          </Clickable.Icon>
        </Clickable.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="end">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar.Root className="size-10 rounded-md border border-neutral-100">
            <Avatar.Image src={sessionData?.data?.user?.image || ""} />
            <Avatar.Fallback>
              {sessionData?.data?.user?.name
                ?.split(" ")
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="flex flex-col items-start gap-0.5">
            <Text.Root weight="medium" size="sm">
              {sessionData?.data?.user?.name || ""}
            </Text.Root>
            <Text.Root size="xs" color="muted">
              {sessionData?.data?.user?.email || ""}
            </Text.Root>
          </div>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link to="/$organizationSlug/settings" params={{ organizationSlug }}>
            <DropdownMenu.ItemIcon>
              <SettingsIcon />
            </DropdownMenu.ItemIcon>
            Settings
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={logout}>
          <DropdownMenu.ItemIcon>
            <LogOutIcon />
          </DropdownMenu.ItemIcon>
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
