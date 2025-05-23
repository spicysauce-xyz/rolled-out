import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/$organizationSlug")({
  component: Outlet,
  beforeLoad: async ({ params, context }) => {
    const currentOrganization = context.organizations.find(
      (organization) => organization.slug === params.organizationSlug,
    );

    if (!currentOrganization) {
      if (context.organizations.length) {
        throw redirect({
          to: "/$organizationSlug",
          params: {
            organizationSlug: context.organizations[0].slug,
          },
        });
      }

      throw redirect({
        to: "/onboarding/organization",
      });
    }

    return {
      organization: currentOrganization,
    };
  },
});
