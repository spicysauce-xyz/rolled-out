import { Confirmer } from "@components/confirmer";
import {
  AccountSetting02Icon,
  Logout02Icon,
  LogoutSquare02Icon,
  MoreVerticalCircle01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { authClient } from "@lib/auth";
import { useLogoutMutation } from "@modules/auth/hooks/use-logout-mutation";
import { Avatar, Button, DropdownMenu, Text, Toaster } from "@mono/ui";
import { Link } from "@tanstack/react-router";

interface UserMenuProps {
  user: (typeof authClient.$Infer.Session)["user"];
  currentOrganizationSlug?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  currentOrganizationSlug,
}) => {
  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = () => {
    Confirmer.confirm({
      title: "Log out",
      description: "Are you sure you want to log out?",
      action: {
        icon: Logout02Icon,
        label: "Yes, log out",
        color: "danger",
        run: () =>
          logout(undefined, {
            onSuccess() {
              Toaster.success("Logged out", {
                description: "You’ve been successfully logged out.",
              });
            },
            onError() {
              Toaster.error("Couldn't log out", {
                description: "Something went wrong. Please try again.",
              });
            },
          }),
      },
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        render={<Button.Root className="flex-1 px-2" variant="tertiary" />}
      >
        <Button.Icon
          render={<HugeiconsIcon icon={UserIcon} strokeWidth={2} />}
        />
        <span className="truncate">{user.name}</span>
        <Button.Icon
          className="ml-auto"
          render={
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} />
          }
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
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
            <Text.Root weight="medium">{user.name}</Text.Root>
            <Text.Root color="muted" size="sm">
              {user.email}
            </Text.Root>
          </div>
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item
            render={
              <Link
                search={{ organization: currentOrganizationSlug }}
                to="/account/profile"
              />
            }
          >
            <DropdownMenu.ItemIcon
              render={
                <HugeiconsIcon icon={AccountSetting02Icon} strokeWidth={2} />
              }
            />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={handleLogout}>
            <DropdownMenu.ItemIcon
              render={
                <HugeiconsIcon icon={LogoutSquare02Icon} strokeWidth={2} />
              }
            />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
