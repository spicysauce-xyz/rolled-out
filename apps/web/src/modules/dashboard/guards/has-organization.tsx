import { organizationsQuery } from "@lib/api/queries";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized/_has-organization")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    if (!context.user.onboarded) {
      throw redirect({
        to: "/onboarding/profile",
      });
    }

    const { data: organizations } = await tryCatch(
      context.queryClient.ensureQueryData(organizationsQuery())
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
