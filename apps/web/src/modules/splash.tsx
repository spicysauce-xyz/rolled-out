import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    if (!context.user.onboarded) {
      throw redirect({
        to: "/onboarding/profile",
      });
    }

    if (!context.organizations.length) {
      throw redirect({
        to: "/onboarding/organization",
      });
    }

    throw redirect({
      to: "/$organizationSlug",
      params: {
        organizationSlug: context.organizations[0].slug,
      },
    });
  },
});
