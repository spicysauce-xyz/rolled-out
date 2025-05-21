import * as Page from "@components/layout/page";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/$organizationSlug/_Dashboard.layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationSlug } = useParams({
    from: "/_authorized/$organizationSlug",
  });

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organizationSlug={organizationSlug} page="Dashboard" />
      </Page.Header>
      <Page.Content>Analytics</Page.Content>
    </Page.Wrapper>
  );
}
