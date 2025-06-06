import * as Page from "@components/layout/page";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DashboardNavigation } from "../components/dashboard-navigation";

export const Route = createFileRoute("/_authorized/_has-organization/$organizationSlug/_index")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, organization } = Route.useRouteContext();

  return (
    <Page.Root>
      <DashboardNavigation user={user} organizationSlug={organization.slug} />
      <Outlet />
    </Page.Root>
  );
}
