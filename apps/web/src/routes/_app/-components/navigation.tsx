import { Avatar, DropdownMenu, Text, Toaster } from "@mono/ui";
import { Link } from "@tanstack/react-router";
import {
  ChartNoAxesColumnIcon,
  EllipsisVerticalIcon,
  HelpCircleIcon,
  ListIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  SmileIcon,
  User2Icon,
} from "lucide-react";
import * as Sidebar from "../../../components/sidebar";
import { useLogout } from "../../../hooks/useLogout";
import { useSession } from "../../../hooks/useSession";

export const Navigation = () => {
  const { data: sessionData } = useSession();
  const logout = useLogout();

  const handleLogout = async () => {
    const toastId = Toaster.loading("Logging out...");

    try {
      await logout();
      Toaster.success("Logged out successfully", { id: toastId });
    } catch {
      Toaster.error("Failed to log out", { id: toastId });
    }
  };

  return (
    <Sidebar.Root className="hidden sm:flex">
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
          <Sidebar.NavLink
            to="/"
            label="Dashboard"
            icon={ChartNoAxesColumnIcon}
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
            <button
              type="button"
              className="group flex w-full items-center gap-2 rounded-md p-2 transition-colors hover:bg-neutral-100"
            >
              <User2Icon className="size-4" />
              <div className="flex flex-col items-start">
                <Text.Root weight="medium" size="sm">
                  {sessionData?.data?.user?.name || ""}
                </Text.Root>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 text-neutral-400 transition-colors group-hover:text-neutral-500" />
            </button>
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
            <Link to="/settings">
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
