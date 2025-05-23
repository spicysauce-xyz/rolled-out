import { queryClient } from "@lib/api";
import { authClient } from "@lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized/")({
  component: Outlet,
  beforeLoad: async () => {
    const organizations = await queryClient.ensureQueryData({
      queryKey: ["organizations"],
      queryFn: async () => {
        const response = await authClient.organization.list();

        if (response.error) {
          throw response.error;
        }

        return response.data;
      },
    });

    if (organizations.length) {
      throw redirect({
        to: "/$organizationSlug",
        params: {
          organizationSlug: organizations[0].slug,
        },
      });
    }

    // TODO: Redirect to create organization
    throw redirect({
      to: "/",
    });
  },
});
