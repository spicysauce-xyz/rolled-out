import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/_layout/$"
)({
  component: Outlet,
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$organizationSlug/updates",
      params: {
        organizationSlug: context.organization.slug,
      },
    });
  },
});
