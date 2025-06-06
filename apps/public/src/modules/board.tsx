import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$boardSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Board by slug</div>;
}
