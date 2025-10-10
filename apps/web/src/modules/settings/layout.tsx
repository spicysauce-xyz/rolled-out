import { Page } from "@components/page";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SettingsNavigation } from "./components/settings-navigation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings"
)({
  component: RouteComponent,
  head: (ctx) => ({
    meta: [
      {
        title: `Settings | ${ctx.match.context.organization.name} x rolledout.xyz`,
      },
    ],
  }),
});

function RouteComponent() {
  const { organization, user } = Route.useRouteContext();

  return (
    <Page.Root>
      <SettingsNavigation organization={organization} user={user} />
      <Page.Wrapper>
        <Page.Header>
          <Breadcrumbs pages={["Settings"]} />
        </Page.Header>
        <Page.Content className="mx-auto w-full max-w-180">
          <Outlet />
        </Page.Content>
      </Page.Wrapper>
    </Page.Root>
  );
}
