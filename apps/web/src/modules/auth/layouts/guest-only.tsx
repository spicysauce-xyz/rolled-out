import { sessionQuery } from "@lib/api/queries";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";
import { z } from "zod";

export const Route = createFileRoute("/_guest-only")({
  component: Outlet,
  beforeLoad: async ({ context, search }) => {
    const { data: session } = await tryCatch(
      context.queryClient.ensureQueryData(sessionQuery()),
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
