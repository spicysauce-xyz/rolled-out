import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_outside/onboarding")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
