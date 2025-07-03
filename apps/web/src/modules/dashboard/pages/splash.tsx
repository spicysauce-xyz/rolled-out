import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/_has-organization/")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/$organizationSlug",
      params: {
        organizationSlug: context.organizations[0].slug,
      },
    });
  },
  component: Outlet,
});
