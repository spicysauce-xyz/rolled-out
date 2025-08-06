import { Confirmer } from "@components/confirmer";
import type { authClient } from "@lib/auth";
import { config } from "@lib/config";
import { useLogoutMutation } from "@modules/auth/hooks/use-logout-mutation";
import { Avatar, Clickable, DropdownMenu, Text } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";

interface UserMenuProps {
  user: (typeof authClient.$Infer.Session)["user"];
  currentOrganizationSlug?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  currentOrganizationSlug,
}) => {
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
      action: {
        icon: LogOutIcon,
        label: "Logout",
        color: "danger",
      },
    });

    if (!confirmed) {
      return;
    }

    await logoutMutation.mutateAsync();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Clickable.Root
          className="flex h-9 w-full items-center px-2 hover:bg-neutral-100 focus-visible:bg-neutral-100"
          variant="tertiary"
        >
          <div className="flex items-center gap-2">
            <User2Icon className="size-4 stroke-neutral-900" />
            <Text.Root size="sm" weight="medium">
              {user.name}
            </Text.Root>
          </div>
          <Clickable.Icon className="ml-auto">
            <EllipsisVerticalIcon />
          </Clickable.Icon>
        </Clickable.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" side="top">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar.Root>
            <Avatar.Image src={user.image || ""} />
            <Avatar.Fallback>
              {user.name
                ?.split(" ")
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="flex flex-col items-start gap-0.5">
            <Text.Root size="sm" weight="medium">
              {user.name}
            </Text.Root>
            <Text.Root color="muted" size="xs">
              {user.email}
            </Text.Root>
          </div>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link
            search={{ organization: currentOrganizationSlug }}
            to="/account/profile"
          >
            <DropdownMenu.ItemIcon>
              <SettingsIcon />
            </DropdownMenu.ItemIcon>
            Settings
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleLogout}>
          <DropdownMenu.ItemIcon>
            <LogOutIcon />
          </DropdownMenu.ItemIcon>
          Logout
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <Text.Root asChild className="px-4 py-1" color="muted" size="xs">
          <a
            className="hover:underline"
            href={`https://github.com/spicysauce-xyz/rolled-out/releases/tag/${config.version}`}
            rel="noreferrer"
            target="_blank"
          >
            Version: {config.version}
          </a>
        </Text.Root>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
