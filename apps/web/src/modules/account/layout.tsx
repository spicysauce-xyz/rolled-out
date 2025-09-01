import { Page } from "@components/page";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { AccountNavigation } from "./components/account-navigation";

export const Route = createFileRoute("/_authorized/account")({
  component: RouteComponent,
  validateSearch: z.object({
    organization: z.string().optional(),
  }),
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <Page.Root>
      <AccountNavigation user={user} />
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
