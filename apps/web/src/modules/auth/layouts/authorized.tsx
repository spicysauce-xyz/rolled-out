import { sessionQuery } from "@lib/api/queries";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized")({
  component: Outlet,
  beforeLoad: async ({ context, location }) => {
    const { data: session } = await tryCatch(
      context.queryClient.ensureQueryData(sessionQuery()),
    );

    if (!session?.data?.session || !session?.data?.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }

    if (!session.data.user.onboarded) {
      throw redirect({
        to: "/onboarding/profile",
      });
    }

    return {
      session: session.data.session,
      user: session.data.user,
    };
  },
});
