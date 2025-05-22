import * as Page from "@components/layout/page";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authorized/$organizationSlug/_Dashboard.layout/contacts",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organizationId={organization.id} page="Contacts" />
      </Page.Header>
      <Page.Content>Contacts</Page.Content>
    </Page.Wrapper>
  );
}
