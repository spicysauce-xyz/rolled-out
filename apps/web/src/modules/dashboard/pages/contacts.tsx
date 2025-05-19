import * as Page from "@components/layout/page";
import { Breadcrumbs } from "@modules/shared/components/breadcrumbs";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/$organizationSlug/contacts")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { organizationSlug } = useParams({
    from: "/_authorized/$organizationSlug/contacts",
  });

  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs organizationSlug={organizationSlug} page="Contacts" />
      </Page.Header>
      <Page.Content>Contacts</Page.Content>
    </Page.Wrapper>
  );
}
