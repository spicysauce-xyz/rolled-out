import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/$",
)({
  component: Outlet,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$organizationSlug/settings/profile",
      params: { organizationSlug: params.organizationSlug },
    });
  },
});
