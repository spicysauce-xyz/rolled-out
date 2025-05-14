import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organizationSlug_/settings/$")({
  component: Outlet,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$organizationSlug/settings/account",
      params: { organizationSlug: params.organizationSlug },
    });
  },
});
