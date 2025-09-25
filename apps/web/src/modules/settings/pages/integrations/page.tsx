import { Toaster } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import z from "zod";
import { GithubCard } from "./components/github-card";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/integrations"
)({
  component: RouteComponent,
  validateSearch: z.object({
    github_setup_completed: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { organization } = Route.useRouteContext();
  const search = Route.useSearch();

  useEffect(() => {
    if (search.github_setup_completed !== undefined) {
      if (search.github_setup_completed) {
        Toaster.success("GitHub connected successfully", {
          description:
            "Your GitHub integration is now active and ready to use.",
        });
      } else {
        Toaster.error("GitHub connection failed", {
          description: "Something went wrong. Please try connecting again.",
        });
      }

      navigate({
        to: ".",
        replace: true,
        params: {
          organizationSlug: organization.slug,
        },
      });
    }
  }, [search.github_setup_completed, navigate, organization.slug]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <GithubCard organizationId={organization.id} />
    </div>
  );
}
