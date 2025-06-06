import { organizationsQuery } from "@lib/api/queries";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { tryCatch } from "@utils/promise";

export const Route = createFileRoute("/_authorized/_has-organization")({
  component: RouteComponent,
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

function RouteComponent() {
  useQuery(organizationsQuery());

  return <Outlet />;
}
