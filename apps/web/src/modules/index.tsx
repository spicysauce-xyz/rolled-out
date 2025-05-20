import * as Confirmer from "@components/feedback/confirmer";
import * as Sidebar from "@components/layout/sidebar";
import { authClient } from "@lib/auth";
import { useLogout } from "@modules/auth/hooks/useLogout";
import { Avatar, Clickable, LinkButton, Text, Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRightIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authorized/")({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useLogout();

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

  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-between gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <Sidebar.Logo />
        <Sidebar.Version />
      </div>
      <div className="flex w-full max-w-80 flex-col gap-2">
        {organizations?.map((organization) => (
          <Clickable.Root
            key={organization.id}
            className="flex items-center gap-2 p-2"
            variant="tertiary"
            asChild
          >
            <Link
              to="/$organizationSlug"
              params={{ organizationSlug: organization.id }}
            >
              <Avatar.Root className="size-10 rounded-md border border-neutral-100">
                <Avatar.Image src={organization.image || ""} />
                <Avatar.Fallback>
                  {organization.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex flex-col items-start gap-0.5">
                <Text.Root weight="medium" size="sm">
                  {organization.name}
                </Text.Root>
                <Text.Root size="xs" color="muted">
                  {organization.slug}
                </Text.Root>
              </div>
              <ChevronRightIcon className="ml-auto size-4" />
            </Link>
          </Clickable.Root>
        ))}
        <Clickable.Root
          className="flex items-center gap-2 p-2"
          variant="tertiary"
        >
          <Avatar.Root className="size-10 rounded-md border border-neutral-100">
            <Avatar.Fallback>
              <PlusIcon className="size-4" />
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="flex flex-col items-start gap-0.5">
            <Text.Root weight="medium" size="sm">
              New Organization
            </Text.Root>
            <Text.Root size="xs" color="muted">
              Create a new organization
            </Text.Root>
          </div>
        </Clickable.Root>
      </div>
      <LinkButton.Root onClick={handleLogout} color="muted">
        Want to log out?
      </LinkButton.Root>
    </div>
  );
}
