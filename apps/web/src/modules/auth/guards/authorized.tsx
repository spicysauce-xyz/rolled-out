import { sessionQuery } from "@lib/api/queries";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authorized")({
  component: AuthorizedComponent,
  beforeLoad: async ({ context, location }) => {
    const { data: session } = await tryCatch(
      context.queryClient.ensureQueryData(sessionQuery())
    );

    if (!(session?.data?.session && session?.data?.user)) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }

    return {
      session: session.data.session,
      user: session.data.user,
    };
  },
});

function AuthorizedComponent() {
  const { user } = Route.useRouteContext();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog.__loaded) {
      return;
    }

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      avatar: user.image,
    });
  }, [posthog, posthog.__loaded, user]);

  return <Outlet />;
}
