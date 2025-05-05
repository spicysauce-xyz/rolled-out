import { Navigation } from "@components/layout/navigation";
import * as Page from "@components/layout/page";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Root>
      <Navigation />
      <Outlet />
    </Page.Root>
  );
}
