import * as Page from "@components/layout/page";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import { SettingsNavigation } from "./components/settings-navigation";

export const Route = createFileRoute("/_authorized/$organizationSlug/settings")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { organizationSlug } = useParams({
    from: "/_authorized/$organizationSlug/settings",
  });

  return (
    <Page.Root>
      <SettingsNavigation />
      <Page.Wrapper>
        <Page.Header>
          <Breadcrumbs organizationSlug={organizationSlug} page="Settings" />
        </Page.Header>
        <Page.Content className="max-w-180">
          <Outlet />
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
