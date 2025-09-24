import { createFileRoute } from "@tanstack/react-router";
import { GithubCard } from "./components/github-card";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/integrations"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <GithubCard organizationId={organization.id} />
    </div>
  );
}
