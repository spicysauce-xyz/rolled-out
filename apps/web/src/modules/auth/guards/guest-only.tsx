import { sessionQuery } from "@lib/api/queries";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_guest-only")({
  component: GuestOnlyComponent,
  beforeLoad: async ({ context, search }) => {
    const { data: session } = await tryCatch(
      context.queryClient.ensureQueryData(sessionQuery())
    );

    if (session?.data?.session) {
      throw redirect({
        to: search.redirect || "/",
      });
    }
  },
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
});

function GuestOnlyComponent() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog.__loaded) {
      return;
    }

    posthog.reset();
  }, [posthog, posthog.__loaded]);

  return <Outlet />;
}
