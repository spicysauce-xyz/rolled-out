import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug"
)({
  component: SelectedOrganizationComponent,
  beforeLoad: ({ params, context }) => {
    const currentOrganization = context.organizations.find(
      (organization) => organization.slug === params.organizationSlug
    );

    if (!currentOrganization) {
      throw redirect({
        to: "/$organizationSlug",
        params: {
          organizationSlug: context.organizations[0].slug,
        },
      });
    }

    return {
      organization: currentOrganization,
    };
  },
});

function SelectedOrganizationComponent() {
  const { organization } = Route.useRouteContext();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog.__loaded) {
      return;
    }

    posthog.group("organization", organization.id, {
      name: organization.name,
    });
  }, [posthog, posthog.__loaded, organization]);

  return <Outlet />;
}
