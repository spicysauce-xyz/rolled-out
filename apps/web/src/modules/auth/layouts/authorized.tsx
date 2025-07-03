import { sessionQuery } from "@lib/api/queries";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized")({
  component: Outlet,
  beforeLoad: async ({ context, location }) => {
    let session = context.queryClient.getQueryData(sessionQuery().queryKey);

    if (!session) {
      const { data: freshSessionData } = await tryCatch(
        context.queryClient.ensureQueryData(sessionQuery())
      );

      session = freshSessionData ?? undefined;
    }

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
