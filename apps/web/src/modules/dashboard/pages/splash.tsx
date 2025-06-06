import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/_has-organization/")({
  beforeLoad: async ({ context }) => {
    throw redirect({
      to: "/$organizationSlug",
      params: {
        organizationSlug: context.organizations[0].slug,
      },
    });
  },
  component: Outlet,
});
