import * as Confirmer from "@components/feedback/confirmer";
import { useLogout } from "@hooks/useLogout";
import { useSession } from "@hooks/useSession";
import { authClient } from "@lib/auth";
import { Avatar, Clickable, DropdownMenu, Text, Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { last } from "lodash";
import {
  BuildingIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";

interface UserMenuProps {
  organizationSlug: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ organizationSlug }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await authClient.organization.list();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });

  const handleUpdateActiveOrganization = async (organizationId: string) => {
    const lastMatch = last(router.state.matches);

    if (!lastMatch) {
      return;
    }

    navigate({
      to: ".",
      params: { ...lastMatch.params, organizationSlug: organizationId },
    });
  };

  const handleLogout = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
    });

    if (!confirmed) return;

    const toastId = Toaster.loading("Logging out...");

    try {
      await logout();
      Toaster.success("Logged out successfully", { id: toastId });
    } catch {
      Toaster.error("Failed to log out", { id: toastId });
    }
  };

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
        <DropdownMenu.RadioGroup
          value={organizationSlug}
          onValueChange={(value) => handleUpdateActiveOrganization(value)}
        >
          {organizations?.map((organization) => (
            <DropdownMenu.RadioItem
              key={organization.id}
              value={organization.id}
            >
              <DropdownMenu.ItemIcon>
                <BuildingIcon />
              </DropdownMenu.ItemIcon>
              {organization.name}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Item>
          <DropdownMenu.ItemIcon>
            <PlusCircleIcon />
          </DropdownMenu.ItemIcon>
          New Organization
        </DropdownMenu.Item>
        <DropdownMenu.Separator />

        <DropdownMenu.Item asChild>
          <Link
            to="/$organizationSlug/settings/account"
            params={{ organizationSlug }}
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
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
