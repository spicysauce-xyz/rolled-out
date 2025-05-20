import * as Page from "@components/layout/page";
import { authClient } from "@lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardNavigation } from "./components/dashboard-navigation";

export const Route = createFileRoute("/_authorized/$organizationSlug")({
  component: RouteComponent,
  // TODO: apply this to Settings.layout.tsx too. Save to query cache too.
  beforeLoad: async ({ params }) => {
    const { data: organization } =
      await authClient.organization.getFullOrganization({
        query: {
          organizationId: params.organizationSlug,
        },
      });

    if (!organization) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return (
    <Page.Root>
      <DashboardNavigation />
      <Outlet />
    </Page.Root>
  );
}
