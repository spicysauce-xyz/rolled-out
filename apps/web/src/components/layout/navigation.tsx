import { confirm } from "@components/feedback/confirmer";
import { Avatar, Clickable, DropdownMenu, Text, Toaster } from "@mono/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BellIcon,
  BuildingIcon,
  EllipsisVerticalIcon,
  HelpCircleIcon,
  ListIcon,
  LogOutIcon,
  MessageCircleIcon,
  PlusCircleIcon,
  SettingsIcon,
  SmileIcon,
  User2Icon,
} from "lucide-react";
import { useLogout } from "../../hooks/useLogout";
import { useSession } from "../../hooks/useSession";
import { api } from "../../lib/api";
import * as Sidebar from "./sidebar";

export const Navigation = () => {
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const logout = useLogout();

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await api.organizations.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      return response.json();
    },
  });

  const updateSession = useMutation({
    mutationFn: api.users.session[":id"].$patch,
  });

  const handleUpdateActiveOrganization = async (organizationId: string) => {
    if (!sessionData?.data?.session?.id) {
      return;
    }

    const toastId = Toaster.loading("Updating active organization...");

    try {
      await updateSession.mutateAsync({
        param: { id: sessionData?.data?.session?.id },
        json: { activeOrganizationId: organizationId },
      });

      await queryClient.invalidateQueries({ queryKey: ["session"] });

      Toaster.success("Active organization updated!", {
        id: toastId,
      });
    } catch {
      Toaster.error("Failed to update active organization", { id: toastId });
    }
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
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
    <Sidebar.Root className="hidden w-64 bg-neutral-50 sm:flex">
      <Sidebar.Header>
        <div className="flex items-center gap-2">
          <SmileIcon className="size-4 stroke-2 stroke-neutral-900" />
          <div className="flex flex-1 items-baseline justify-between gap-1">
            <Text.Root size="sm" weight="medium">
              Brand
            </Text.Root>
            <Text.Root size="xs" color="muted">
              v0.0.1 · h1a2sh3
            </Text.Root>
          </div>
        </div>
      </Sidebar.Header>
      <Sidebar.ScrollArea>
        <Sidebar.Group>
          <Sidebar.NavLink to="/" label="Updates" icon={BellIcon} />
          <Sidebar.NavLink
            to="/settings"
            label="Settings"
            icon={SettingsIcon}
          />
        </Sidebar.Group>
        <Sidebar.Fill />
        <Sidebar.Group>
          <Sidebar.Link href="#" label="Feedback" icon={MessageCircleIcon} />
          <Sidebar.Link href="#" label="Changelog" icon={ListIcon} />
          <Sidebar.Link href="#" label="Support" icon={HelpCircleIcon} />
        </Sidebar.Group>
      </Sidebar.ScrollArea>
      <Sidebar.Footer className="p-2">
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
                  {sessionData?.data?.user?.name?.slice(0, 2).toUpperCase()}
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
              value={sessionData?.data?.session?.activeOrganizationId || ""}
              onValueChange={(value) => handleUpdateActiveOrganization(value)}
            >
              {organizations?.data?.map((organization) => (
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

            <Link to="/account">
              <DropdownMenu.Item>
                <DropdownMenu.ItemIcon>
                  <SettingsIcon />
                </DropdownMenu.ItemIcon>
                Settings
              </DropdownMenu.Item>
            </Link>
            <DropdownMenu.Item onClick={handleLogout}>
              <DropdownMenu.ItemIcon>
                <LogOutIcon />
              </DropdownMenu.ItemIcon>
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
};
