import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$boardSlug/$postSlug")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Post</div>;
}
