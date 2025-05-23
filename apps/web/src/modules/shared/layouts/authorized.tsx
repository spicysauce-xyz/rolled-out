import { queryClient } from "@lib/api";
import { authClient } from "@lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authorized")({
  component: Outlet,
  beforeLoad: async () => {
    const session = await queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: async () => {
        const response = await authClient.getSession();

        if (response.error) {
          throw response.error;
        }

        return response;
      },
    });

    // if user is not logged in, redirect to login
    if (!session || !session.data) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (!session.data.user.onboarded) {
      throw redirect({
        to: "/onboarding/profile",
      });
    }

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

    return {
      session: session.data.session,
      user: session.data.user,
      organizations,
    };
  },
});
