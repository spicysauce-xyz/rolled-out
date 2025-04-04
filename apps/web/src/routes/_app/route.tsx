import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Navigation } from "./-components/navigation";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  beforeLoad: async ({ location, context }) => {
    if (!context.auth?.session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function AppLayout() {
  return (
    <div className="grid h-svh bg-neutral-50 sm:grid-cols-[calc(var(--spacing)*64)_1fr]">
      <Navigation />
      <Outlet />
    </div>
  );
}
