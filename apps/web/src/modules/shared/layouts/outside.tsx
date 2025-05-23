import * as Sidebar from "@components/layout/sidebar";
import { queryClient } from "@lib/api";
import { authClient } from "@lib/auth";
import { LinkButton } from "@mono/ui";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";

export const Route = createFileRoute("/_outside")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: async () => {
        const response = await authClient.getSession();

        if (response.error) {
          throw response.error;
        }

        return response;
      },
    });

    return {
      session: session?.data?.session ?? null,
      user: session?.data?.user ?? null,
    };
  },
});

function RouteComponent() {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <div className="flex w-full items-center justify-between border-neutral-100 border-b px-6 py-4">
        <Sidebar.Logo />
        <Sidebar.Version />
      </div>
      <Outlet />
      <div className="flex w-full items-center justify-between gap-6 border-neutral-100 border-t px-6 py-4">
        <div className="flex items-center gap-4">
          <LinkButton.Root size="sm" color="muted">
            Privacy Policy
          </LinkButton.Root>
          <LinkButton.Root size="sm" color="muted">
            Terms of Service
          </LinkButton.Root>
        </div>
        <LinkButton.Root size="sm" color="muted">
          <LinkButton.Icon>
            <MailIcon />
          </LinkButton.Icon>
          Contact Us
        </LinkButton.Root>
      </div>
    </div>
  );
}
