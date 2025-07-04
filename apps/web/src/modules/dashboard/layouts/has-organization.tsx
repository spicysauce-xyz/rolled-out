import { organizationsQuery } from "@lib/api/queries";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized/_has-organization")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    if (!context.user.onboarded) {
      throw redirect({
        to: "/onboarding/profile",
      });
    }

    let organizations = context.queryClient.getQueryData(
      organizationsQuery().queryKey,
    );

    if (!organizations) {
      const { data: freshOrganizations } = await tryCatch(
        context.queryClient.ensureQueryData(organizationsQuery()),
      );

      organizations = freshOrganizations ?? undefined;
    }

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
