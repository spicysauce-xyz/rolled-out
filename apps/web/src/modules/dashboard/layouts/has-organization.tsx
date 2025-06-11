import { organizationsQuery } from "@lib/api/queries";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized/_has-organization")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    const { data: organizations } = await tryCatch(
      context.queryClient.ensureQueryData(organizationsQuery()),
    );

    if (!organizations?.length) {
      throw redirect({
        to: "/onboarding/organization",
      });
    }

    return {
      organizations,
    };
  },
});
