import * as Page from "@components/layout/page";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SettingsNavigation } from "./components/settings-navigation";

export const Route = createFileRoute("/_authorized/$organizationSlug/settings")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { organization } = Route.useRouteContext();

  return (
    <Page.Root>
      <SettingsNavigation />
      <Page.Wrapper>
        <Page.Header>
          <Breadcrumbs organizationId={organization.id} page="Settings" />
        </Page.Header>
        <Page.Content className="mx-auto w-full max-w-180">
          <Outlet />
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
