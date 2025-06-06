import { sessionQuery } from "@lib/api/queries";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_guest-only")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    const { data: session } = await tryCatch(
      context.queryClient.ensureQueryData(sessionQuery()),
    );

    if (session?.data?.session) {
      throw redirect({
        to: "/",
      });
    }
  },
});
