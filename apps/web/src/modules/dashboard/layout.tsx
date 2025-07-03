import { Page } from "@components/page";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNavigation } from "./components/dashboard-navigation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, organization } = Route.useRouteContext();

  return (
    <Page.Root>
      <DashboardNavigation
        organizationId={organization.id}
        organizationSlug={organization.slug}
        user={user}
      />
      <Outlet />
    </Page.Root>
  );
}
