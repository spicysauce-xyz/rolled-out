import * as Page from "@components/layout/page";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DashboardNavigation } from "./components/dashboard-navigation";

export const Route = createFileRoute("/_authorized/$organizationSlug/_Dashboard.layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Root>
      <DashboardNavigation />
      <Outlet />
    </Page.Root>
  );
}
