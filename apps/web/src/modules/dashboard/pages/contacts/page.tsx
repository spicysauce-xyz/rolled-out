import { Page } from "@components/page";
import { Breadcrumbs } from "@modules/dashboard/components/breadcrumbs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/contacts"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Wrapper>
      <Page.Header className="justify-between">
        <Breadcrumbs pages={["Contacts"]} />
      </Page.Header>
      <Page.Content>Contacts</Page.Content>
    </Page.Wrapper>
  );
}
