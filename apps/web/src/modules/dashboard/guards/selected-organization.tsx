import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug"
)({
  component: Outlet,
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
